package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.SingleEvent;
import com.sporteventstournaments.domain.SingleEventParticipant;
import com.sporteventstournaments.domain.SingleEventParticipantId;
import com.sporteventstournaments.domain.dto.SingleEventDTO;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.exception.InvalidOperationException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.repository.SingleEventParticipantRepository;
import com.sporteventstournaments.repository.SingleEventRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class SingleEventService {
    private final SingleEventRepository singleEventRepository;
    private final EventRepository eventRepository;
    private final SingleEventParticipantRepository participantRepository;
    private final SecurityService securityService;

    public List<SingleEvent> getAllSingleEvents() {
        return singleEventRepository.findAll();
    }

    public SingleEvent getSingleEventById(Long id) {
        return singleEventRepository.findById(id).orElseThrow(EventNotFoundException::new);
    }

    public List<SingleEvent> getSingleEventsByStatus(SingleEvent.SingleEventStatus status) {
        return singleEventRepository.findByStatus(status);
    }

    @Transactional
    public SingleEvent createSingleEvent(SingleEventDTO singleEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        // Create event first (assuming the EventService has been called to create the general Event)
        Event event = eventRepository.findById(singleEventDTO.getEvent().getId())
                .orElseThrow(EventNotFoundException::new);
        System.out.println(event);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!event.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can create a single event for this event");
        }

        SingleEvent singleEvent = new SingleEvent();
//        singleEvent.setId(singleEventDTO.getEvent().getId());
        singleEvent.setEvent(event);
        singleEvent.setMaxParticipants(singleEventDTO.getMaxParticipants());
        singleEvent.setStatus(SingleEvent.SingleEventStatus.PENDING);

        System.out.println(singleEvent);

        return singleEventRepository.save(singleEvent);
    }

    public SingleEvent updateSingleEvent(Long id, SingleEventDTO singleEventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        SingleEvent existingSingleEvent = singleEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingSingleEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update this single event");
        }

        existingSingleEvent.setMaxParticipants(singleEventDTO.getMaxParticipants());
        existingSingleEvent.setStatus(singleEventDTO.getStatus());

        return singleEventRepository.saveAndFlush(existingSingleEvent);
    }

    @Transactional
    public void deleteSingleEvent(Long id, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        SingleEvent existingSingleEvent = singleEventRepository.findById(id)
                .orElseThrow(EventNotFoundException::new);

        // Check if the user is the creator of the event
        Long userId = securityService.getUserIdByLogin(principal.getName());
        if (!existingSingleEvent.getEvent().getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can delete this single event");
        }

        // Delete all participants first (cascade would work too with proper setup)
        List<SingleEventParticipant> participants = participantRepository.findByEventId(id);
        participantRepository.deleteAll(participants);

        // Then delete the single event
        singleEventRepository.deleteById(id);
    }

    @Transactional
    public SingleEventParticipant addParticipant(Long eventId, Long userId, Principal principal) {
        SingleEvent singleEvent = singleEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Check if the event allows more participants
        int currentParticipants = participantRepository.countParticipantsByEventId(eventId);
        if (currentParticipants >= singleEvent.getMaxParticipants()) {
            throw new InvalidOperationException("This event has reached its maximum number of participants");
        }

        // Check if the participant is already added
        SingleEventParticipantId id = new SingleEventParticipantId(eventId, userId);
        if (participantRepository.existsById(id)) {
            throw new InvalidOperationException("User is already a participant in this event");
        }

        SingleEventParticipant participant = new SingleEventParticipant();
        participant.setEventId(eventId);
        participant.setUserId(userId);
        participant.setSingleEvent(singleEvent);
        participant.setInvitationSent(false);
        participant.setAccepted(false);
        participant.setJoinedAt(LocalDateTime.now());

        return participantRepository.save(participant);
    }

    @Transactional
    public void removeParticipant(Long eventId, Long userId, Principal principal) {
        SingleEvent singleEvent = singleEventRepository.findById(eventId)
                .orElseThrow(EventNotFoundException::new);

        // Only the event creator or admin can remove participants
        Long currentUserId = securityService.getUserIdByLogin(principal.getName());
        if (!singleEvent.getEvent().getCreatedBy().equals(currentUserId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can remove participants");
        }

        SingleEventParticipantId id = new SingleEventParticipantId(eventId, userId);
        participantRepository.deleteById(id);
    }

    public List<SingleEventParticipant> getParticipantsByEventId(Long eventId) {
        return participantRepository.findByEventId(eventId);
    }

    public List<SingleEventParticipant> getEventsByUserId(Long userId) {
        return participantRepository.findByUserId(userId);
    }
}