package com.sporteventstournaments.controller.events;

import com.sporteventstournaments.domain.Event;
import com.sporteventstournaments.domain.dto.EventDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sporteventstournaments.exception.EventNotFoundException;

import java.security.Principal;
import java.util.List;

@Tag(name = "Event Controller", description = "Manages operations related to events")
@RestController
@AllArgsConstructor
@RequestMapping("/event")
public class EventController {

    private final EventService eventService;
    private final SecurityService securityService;

    @Operation(summary = "Get all events (for authorized users)")
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(Principal principal) {
        List<Event> events = eventService.getAllEvents();
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(events, HttpStatus.OK);
        }
    }

    @Operation(summary = "Get event by ID (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Event event = eventService.getEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @Operation(summary = "Get events by type (for authorized users)")
    @GetMapping("/type")
    public ResponseEntity<List<Event>> getEventsByType(@RequestParam Event.EventType eventType, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Event> events = eventService.getEventsByType(eventType);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(events, HttpStatus.OK);
        }
    }

    @Operation(summary = "Get events created by a specific user (admin only)")
    @GetMapping("/creator/{userId}")
    public ResponseEntity<List<Event>> getEventsByCreator(@PathVariable Long userId, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Event> events = eventService.getEventsByCreator(userId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(events, HttpStatus.OK);
        }
    }

    @Operation(summary = "Create a new event (for authenticated users)")
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody EventDTO eventDTO, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Event event = eventService.createEvent(eventDTO, principal);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @Operation(summary = "Update an event (creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id,
                                             @RequestBody EventDTO eventDTO,
                                             Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Event updatedEvent = eventService.updateEvent(id, eventDTO, principal);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }

    @Operation(summary = "Delete an event (creator or admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEvent(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        eventService.deleteEvent(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Find event by name (for authorized users)")
    @GetMapping("/find")
    public ResponseEntity<Event> findEventByName(@RequestParam String name, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        Event event = eventService.findEventByName(name).orElseThrow(EventNotFoundException::new);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }
}
