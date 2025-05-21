package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.dto.EventDTO;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import com.sporteventstournaments.repository.EventRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final SecurityService securityService;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(EventNotFoundException::new);
    }

    public List<Event> getEventsByType(Event.EventType eventType) {
        return eventRepository.findByEventType(eventType);
    }

    public List<Event> getEventsByCreator(Long userId) {
        return eventRepository.findByCreatedBy(userId);
    }

    public Event createEvent(EventDTO eventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        Long userId = securityService.getUserIdByLogin(principal.getName());

        Event event = new Event();
        event.setEventName(eventDTO.getEventName());
        event.setEventDate(eventDTO.getEventDate());
        event.setEventLocation(eventDTO.getEventLocation());
        event.setEventType(eventDTO.getEventType());
        event.setCreatedBy(userId);
        event.setCreatedAt(LocalDateTime.now());

        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, EventDTO eventDTO, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        Event existingEvent = eventRepository.findById(id).orElseThrow(EventNotFoundException::new);

        Long userId = securityService.getUserIdByLogin(principal.getName());

        // Only the creator or admin can update the event
        if (!existingEvent.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can update this event");
        }

        existingEvent.setEventName(eventDTO.getEventName());
        existingEvent.setEventDate(eventDTO.getEventDate());
        existingEvent.setEventLocation(eventDTO.getEventLocation());
        // EventType should not be changed as it would affect the related specific event tables

        return eventRepository.save(existingEvent);
    }

    @Transactional
    public void deleteEvent(Long id, Principal principal) {
        if (principal == null) {
            throw new ForbiddenOperationException("User must be authenticated");
        }

        Event existingEvent = eventRepository.findById(id).orElseThrow(EventNotFoundException::new);

        Long userId = securityService.getUserIdByLogin(principal.getName());

        // Only the creator or admin can delete the event
        if (!existingEvent.getCreatedBy().equals(userId) && !securityService.checkIfAdmin(principal.getName())) {
            throw new ForbiddenOperationException("Only the event creator or admin can delete this event");
        }

        eventRepository.deleteById(id);
    }

    public Optional<Event> findEventByName(String eventName) {
        return eventRepository.findByEventName(eventName);
    }
}