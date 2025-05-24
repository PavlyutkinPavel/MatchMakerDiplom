package com.sporteventstournaments.service;

import com.sporteventstournaments.controller.events.PlayOffEventController;
import com.sporteventstournaments.domain.PlayoffEvent;
import com.sporteventstournaments.domain.PlayoffEvent.PlayoffEventStatus;
import com.sporteventstournaments.domain.PlayoffMatch;
import com.sporteventstournaments.domain.PlayoffMatchId;
import com.sporteventstournaments.exception.ResourceNotFoundException;
import com.sporteventstournaments.exception.BusinessException;
import com.sporteventstournaments.repository.PlayoffEventRepository;
import com.sporteventstournaments.repository.PlayoffMatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PlayOffEventService {

    private final PlayoffEventRepository playoffEventRepository;
    private final PlayoffMatchRepository playoffMatchRepository;

    public PlayOffEventController.PlayoffEventResponse createPlayoffEvent(PlayOffEventController.CreatePlayoffEventRequest request) {
        log.info("Creating playoff event for event ID: {}", request.getEventId());

        // Validate bracket size is power of 2
        if (!isPowerOfTwo(request.getBracketSize())) {
            throw new BusinessException("Bracket size must be a power of 2");
        }

        // Check if playoff event already exists for this event
        if (playoffEventRepository.existsByEventId(request.getEventId())) {
            throw new BusinessException("Playoff event already exists for this event");
        }

        PlayoffEvent playoffEvent = new PlayoffEvent();
        playoffEvent.setId(request.getEventId()); // Using same ID as base event
        playoffEvent.setBracketSize(request.getBracketSize());
        playoffEvent.setStatus(request.getStatus());

        PlayoffEvent saved = playoffEventRepository.save(playoffEvent);

        // Generate bracket matches
        generateBracketMatches(saved);

        log.info("Created playoff event with ID: {}", saved.getId());
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PlayOffEventController.PlayoffEventResponse getPlayoffEvent(Long id) {
        log.info("Fetching playoff event with ID: {}", id);

        PlayoffEvent playoffEvent = playoffEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playoff event not found with ID: " + id));

        return mapToResponse(playoffEvent);
    }

    @Transactional(readOnly = true)
    public Page<PlayOffEventController.PlayoffEventResponse> getAllPlayoffEvents(Pageable pageable) {
        log.info("Fetching all playoff events with pagination");

        return playoffEventRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public List<PlayOffEventController.PlayoffEventResponse> getPlayoffEventsByStatus(PlayoffEventStatus status) {
        log.info("Fetching playoff events with status: {}", status);

        return playoffEventRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PlayOffEventController.PlayoffEventResponse updatePlayoffEvent(Long id, PlayOffEventController.UpdatePlayoffEventRequest request) {
        log.info("Updating playoff event with ID: {}", id);

        PlayoffEvent playoffEvent = playoffEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playoff event not found with ID: " + id));

        if (request.getStatus() != null) {
            validateStatusTransition(playoffEvent.getStatus(), request.getStatus());
            playoffEvent.setStatus(request.getStatus());
        }

        if (request.getBracketSize() != null) {
            if (playoffEvent.getStatus() != PlayoffEventStatus.DRAFT) {
                throw new BusinessException("Cannot change bracket size after playoff has started");
            }

            if (!isPowerOfTwo(request.getBracketSize())) {
                throw new BusinessException("Bracket size must be a power of 2");
            }

            playoffEvent.setBracketSize(request.getBracketSize());

            // Regenerate matches if bracket size changed
            playoffMatchRepository.deleteByEventId(id);
            generateBracketMatches(playoffEvent);
        }

        PlayoffEvent updated = playoffEventRepository.save(playoffEvent);
        log.info("Updated playoff event with ID: {}", id);

        return mapToResponse(updated);
    }

    public void deletePlayoffEvent(Long id) {
        log.info("Deleting playoff event with ID: {}", id);

        if (!playoffEventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Playoff event not found with ID: " + id);
        }

        // Delete associated matches first
        playoffMatchRepository.deleteByEventId(id);
        playoffEventRepository.deleteById(id);

        log.info("Deleted playoff event with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<PlayOffEventController.PlayoffMatchResponse> getPlayoffMatches(Long eventId) {
        log.info("Fetching playoff matches for event ID: {}", eventId);

        if (!playoffEventRepository.existsById(eventId)) {
            throw new ResourceNotFoundException("Playoff event not found with ID: " + eventId);
        }

        return playoffMatchRepository.findByEventIdOrderByRoundAscMatchNumberAsc(eventId).stream()
                .map(this::mapToMatchResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PlayOffEventController.PlayoffMatchResponse> getPlayoffMatchesByRound(Long eventId, Integer round) {
        log.info("Fetching playoff matches for event ID: {} and round: {}", eventId, round);

        return playoffMatchRepository.findByEventIdAndRound(eventId, round).stream()
                .map(this::mapToMatchResponse)
                .collect(Collectors.toList());
    }

    public void startPlayoffEvent(Long id) {
        log.info("Starting playoff event with ID: {}", id);

        PlayoffEvent playoffEvent = playoffEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playoff event not found with ID: " + id));

        if (playoffEvent.getStatus() != PlayoffEventStatus.DRAFT) {
            throw new BusinessException("Can only start playoff events in DRAFT status");
        }

        playoffEvent.setStatus(PlayoffEventStatus.ACTIVE);
        playoffEventRepository.save(playoffEvent);

        log.info("Started playoff event with ID: {}", id);
    }

    public void completePlayoffEvent(Long id) {
        log.info("Completing playoff event with ID: {}", id);

        PlayoffEvent playoffEvent = playoffEventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playoff event not found with ID: " + id));

        if (playoffEvent.getStatus() != PlayoffEventStatus.ACTIVE) {
            throw new BusinessException("Can only complete active playoff events");
        }

        // Check if all matches are completed
        List<PlayoffMatch> unfinishedMatches = playoffMatchRepository.findUnfinishedMatchesByEventId(id);
        if (!unfinishedMatches.isEmpty()) {
            throw new BusinessException("Cannot complete playoff event with unfinished matches");
        }

        playoffEvent.setStatus(PlayoffEventStatus.COMPLETED);
        playoffEventRepository.save(playoffEvent);

        log.info("Completed playoff event with ID: {}", id);
    }

    private void generateBracketMatches(PlayoffEvent playoffEvent) {
        int bracketSize = playoffEvent.getBracketSize();
        int totalMatches = bracketSize - 1;
        int matchNumber = 1;

        // Calculate number of rounds
        int rounds = (int) (Math.log(bracketSize) / Math.log(2));

        for (int round = 1; round <= rounds; round++) {
            int matchesInRound = bracketSize / (int) Math.pow(2, round);

            for (int i = 0; i < matchesInRound; i++) {
                PlayoffMatch match = new PlayoffMatch();
                match.setEventId(playoffEvent.getId());
                match.setMatchNumber(matchNumber++);
                match.setRound(round);

                playoffMatchRepository.save(match);
            }
        }

        log.info("Generated {} matches for playoff event {}", totalMatches, playoffEvent.getId());
    }

    private boolean isPowerOfTwo(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    private void validateStatusTransition(PlayoffEventStatus current, PlayoffEventStatus target) {
        if (current == PlayoffEventStatus.COMPLETED) {
            throw new BusinessException("Cannot change status of completed playoff event");
        }

        if (current == PlayoffEventStatus.DRAFT && target == PlayoffEventStatus.COMPLETED) {
            throw new BusinessException("Cannot complete playoff event directly from draft status");
        }
    }

    private PlayOffEventController.PlayoffEventResponse mapToResponse(PlayoffEvent playoffEvent) {
        PlayOffEventController.PlayoffEventResponse response = new PlayOffEventController.PlayoffEventResponse();
        response.setId(playoffEvent.getId());
        response.setStatus(playoffEvent.getStatus());
        response.setBracketSize(playoffEvent.getBracketSize());

        if (playoffEvent.getEvent() != null) {
            PlayOffEventController.EventSummaryDto eventSummary = new PlayOffEventController.EventSummaryDto();
            eventSummary.setId(playoffEvent.getEvent().getId());
            eventSummary.setName(playoffEvent.getEvent().getEventName());
            //eventSummary.setDescription(playoffEvent.getEvent().getDescription());
            response.setEvent(eventSummary);
        }

        // Calculate match statistics
        List<PlayoffMatch> matches = playoffMatchRepository.findByEventId(playoffEvent.getId());
        response.setTotalMatches(matches.size());
        response.setCompletedMatches((int) matches.stream()
                .filter(match -> match.getWinnerTeamId() != null)
                .count());

        return response;
    }

    private PlayOffEventController.PlayoffMatchResponse mapToMatchResponse(PlayoffMatch match) {
        PlayOffEventController.PlayoffMatchResponse response = new PlayOffEventController.PlayoffMatchResponse();
        response.setEventId(match.getEventId());
        response.setMatchNumber(match.getMatchNumber());
        response.setRound(match.getRound());
        response.setTeam1Id(match.getTeam1Id());
        response.setTeam2Id(match.getTeam2Id());
        response.setTeam1Score(match.getTeam1Score());
        response.setTeam2Score(match.getTeam2Score());
        response.setWinnerTeamId(match.getWinnerTeamId());
        response.setMatchStartTime(match.getMatchStartTime());
        return response;
    }
}