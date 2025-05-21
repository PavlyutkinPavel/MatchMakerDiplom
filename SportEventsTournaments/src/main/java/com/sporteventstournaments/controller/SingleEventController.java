package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.SingleEvent;
import com.sporteventstournaments.domain.SingleEventParticipant;
import com.sporteventstournaments.domain.dto.SingleEventDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.SingleEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(name = "Single Event Controller", description = "Operations related to single events and participants")
@RestController
@AllArgsConstructor
@RequestMapping("/single-event")
public class SingleEventController {

    private final SingleEventService singleEventService;
    private final SecurityService securityService;

    @Operation(summary = "Get all single events (authorized users only)")
    @GetMapping
    public ResponseEntity<List<SingleEvent>> getAllSingleEvents(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<SingleEvent> events = singleEventService.getAllSingleEvents();
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Get single event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<SingleEvent> getSingleEventById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        SingleEvent event = singleEventService.getSingleEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @Operation(summary = "Get single events by status")
    @GetMapping("/status")
    public ResponseEntity<List<SingleEvent>> getByStatus(@RequestParam SingleEvent.SingleEventStatus status,
                                                         Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<SingleEvent> events = singleEventService.getSingleEventsByStatus(status);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Create a single event (event creator or admin only)")
    @PostMapping
    public ResponseEntity<SingleEvent> create(@RequestBody SingleEventDTO dto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        SingleEvent created = singleEventService.createSingleEvent(dto, principal);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Update a single event (event creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<SingleEvent> update(@PathVariable Long id,
                                              @RequestBody SingleEventDTO dto,
                                              Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        SingleEvent updated = singleEventService.updateSingleEvent(id, dto, principal);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Operation(summary = "Delete a single event (event creator or admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        singleEventService.deleteSingleEvent(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Add a participant to a single event")
    @PostMapping("/{eventId}/participant/{userId}")
    public ResponseEntity<SingleEventParticipant> addParticipant(@PathVariable Long eventId,
                                                                 @PathVariable Long userId,
                                                                 Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        SingleEventParticipant participant = singleEventService.addParticipant(eventId, userId, principal);
        return new ResponseEntity<>(participant, HttpStatus.CREATED);
    }

    @Operation(summary = "Remove a participant from a single event (creator or admin only)")
    @DeleteMapping("/{eventId}/participant/{userId}")
    public ResponseEntity<HttpStatus> removeParticipant(@PathVariable Long eventId,
                                                        @PathVariable Long userId,
                                                        Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        singleEventService.removeParticipant(eventId, userId, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get participants of a single event")
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<SingleEventParticipant>> getParticipants(@PathVariable Long eventId,
                                                                        Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<SingleEventParticipant> participants = singleEventService.getParticipantsByEventId(eventId);
        if (participants.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(participants, HttpStatus.OK);
    }

    @Operation(summary = "Get single events a user participates in (admin only)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SingleEventParticipant>> getUserEvents(@PathVariable Long userId,
                                                                      Principal principal) {
        if (principal == null || !securityService.checkIfAdmin(principal.getName())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        List<SingleEventParticipant> events = singleEventService.getEventsByUserId(userId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
