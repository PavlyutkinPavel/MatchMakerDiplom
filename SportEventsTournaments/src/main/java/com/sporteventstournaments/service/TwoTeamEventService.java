package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.TwoTeamEvent;
import com.sporteventstournaments.domain.dto.TwoTeamEventDTO;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.repository.TwoTeamEventRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class TwoTeamEventService {
    private final TwoTeamEventRepository twoTeamEventRepository;
    private final EventRepository eventRepository;
    private final SecurityService securityService;

    public List<TwoTeamEvent> getAllTwoTeamEvents() {
        return twoTeamEventRepository.findAll();
    }

    public TwoTeamEvent getTwoTeamEventById(Long id) {
        return twoTeamEventRepository.findById(id).orElseThrow(EventNotFoundException::new);
    }

    public List<TwoTeamEvent> getTwoTeamEventsByStatus(TwoTeamEvent.TwoTeamEventStatus status) {
        return twoTeamEventRepository.findByStatus(status);
    }

    public List<TwoTeamEvent> getTwoTeamEventsByTeamId(Long teamId) {
        return twoTeamEventRepository.findByTeamId(teamId);
    }

    @Transactional
    public TwoTeamEvent createTwoTeamEvent(TwoTeamEventDTO twoTeamEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        // Create event first (assuming the EventService has been called to create the general Event)
        Event event = eventRepository.findById(twoTeamEventDTO.getEventId())
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!event.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can create a two team event for this event");
        }

        TwoTeamEvent twoTeamEvent = new TwoTeamEvent();
        twoTeamEvent.setEventId(event.getId());
        twoTeamEvent.setEvent(event);
        twoTeamEvent.setTeam1Id(twoTeamEventDTO.getTeam1Id());
        twoTeamEvent.setTeam2Id(twoTeamEventDTO.getTeam2Id());
        twoTeamEvent.setStatus(TwoTeamEvent.TwoTeamEventStatus.PENDING);
        twoTeamEvent.setTeam1Score(0);
        twoTeamEvent.setTeam2Score(0);

        return twoTeamEventRepository.save(twoTeamEvent);
    }

    public TwoTeamEvent updateTwoTeamEvent(Long id, TwoTeamEventDTO twoTeamEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        TwoTeamEvent existingTwoTeamEvent = twoTeamEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingTwoTeamEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update this two team event");
        }

        existingTwoTeamEvent.setTeam1Id(twoTeamEventDTO.getTeam1Id());
        existingTwoTeamEvent.setTeam2Id(twoTeamEventDTO.getTeam2Id());
        existingTwoTeamEvent.setStatus(twoTeamEventDTO.getStatus());
        existingTwoTeamEvent.setTeam1Score(twoTeamEventDTO.getTeam1Score());
        existingTwoTeamEvent.setTeam2Score(twoTeamEventDTO.getTeam2Score());

        return twoTeamEventRepository.save(existingTwoTeamEvent);
    }

    @Transactional
    public void deleteTwoTeamEvent(Long id, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        TwoTeamEvent existingTwoTeamEvent = twoTeamEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingTwoTeamEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can delete this two team event");
        }

        twoTeamEventRepository.deleteById(id);
    }

    public TwoTeamEvent updateScores(Long id, Integer team1Score, Integer team2Score, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        TwoTeamEvent existingTwoTeamEvent = twoTeamEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingTwoTeamEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update scores");
        }

        existingTwoTeamEvent.setTeam1Score(team1Score);
        existingTwoTeamEvent.setTeam2Score(team2Score);

        // If scores are updated, we can set the status to COMPLETED
        if (team1Score != null && team2Score != null) {
            existingTwoTeamEvent.setStatus(TwoTeamEvent.TwoTeamEventStatus.COMPLETED);
        }

        return twoTeamEventRepository.save(existingTwoTeamEvent);
    }
}