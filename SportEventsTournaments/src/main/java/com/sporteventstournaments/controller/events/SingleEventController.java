package com.sporteventstournaments.controller.events;

import com.sporteventstournaments.domain.SingleEvent;
import com.sporteventstournaments.domain.SingleEventParticipant;
import com.sporteventstournaments.service.SingleEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
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

    // ================ REQUEST DTOs ================

    @Data
    public static class CreateSingleEventRequest {
        private Long eventId;
        private Integer maxParticipants;
        private List<Long> participantIds; // массив ID участников для добавления сразу
    }

    @Data
    public static class UpdateSingleEventRequest {
        private Integer maxParticipants;
        private SingleEvent.SingleEventStatus status;
    }

    @Data
    public static class AddParticipantsRequest {
        private List<Long> userIds;
    }

    // ================ MAIN ENDPOINTS ================

    @Operation(summary = "Get all single events (authorized users only)")
    @GetMapping
    public ResponseEntity<List<SingleEvent>> getAllSingleEvents(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SingleEvent> events = singleEventService.getAllSingleEvents();
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Get single event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<SingleEvent> getSingleEventById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEvent event = singleEventService.getSingleEventById(id);
        return ResponseEntity.ok(event);
    }

    @Operation(summary = "Get single events by status")
    @GetMapping("/status")
    public ResponseEntity<List<SingleEvent>> getByStatus(
            @RequestParam SingleEvent.SingleEventStatus status,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SingleEvent> events = singleEventService.getSingleEventsByStatus(status);
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Create a single event (event creator or admin only)")
    @PostMapping
    public ResponseEntity<SingleEvent> createSingleEvent(
            @RequestBody CreateSingleEventRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEvent created = singleEventService.createSingleEvent(
                request.getEventId(),
                request.getMaxParticipants(),
                request.getParticipantIds(),
                principal
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a single event (event creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<SingleEvent> updateSingleEvent(
            @PathVariable Long id,
            @RequestBody UpdateSingleEventRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEvent updated = singleEventService.updateSingleEvent(
                id,
                request.getMaxParticipants(),
                request.getStatus(),
                principal
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a single event (event creator or admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSingleEvent(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        singleEventService.deleteSingleEvent(id, principal);
        return ResponseEntity.noContent().build();
    }

    // ================ PARTICIPANT MANAGEMENT ================

    @Operation(summary = "Add a single participant to event")
    @PostMapping("/{eventId}/participant/{userId}")
    public ResponseEntity<SingleEventParticipant> addParticipant(
            @PathVariable Long eventId,
            @PathVariable Long userId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEventParticipant participant = singleEventService.addParticipant(eventId, userId, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(participant);
    }

    @Operation(summary = "Add multiple participants to event")
    @PostMapping("/{eventId}/participants")
    public ResponseEntity<List<SingleEventParticipant>> addParticipants(
            @PathVariable Long eventId,
            @RequestBody AddParticipantsRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SingleEventParticipant> participants = singleEventService.addParticipants(
                eventId,
                request.getUserIds(),
                principal
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(participants);
    }

    @Operation(summary = "Remove a participant from event (creator or admin only)")
    @DeleteMapping("/{eventId}/participant/{userId}")
    public ResponseEntity<Void> removeParticipant(
            @PathVariable Long eventId,
            @PathVariable Long userId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        singleEventService.removeParticipant(eventId, userId, principal);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Get participants of a single event")
    @GetMapping("/{eventId}/participants")
    public ResponseEntity<List<SingleEventParticipant>> getParticipants(
            @PathVariable Long eventId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<SingleEventParticipant> participants = singleEventService.getParticipantsByEventId(eventId);
        if (participants.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(participants);
    }

    @Operation(summary = "Get single events a user participates in (admin only)")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SingleEventParticipant>> getUserEvents(
            @PathVariable Long userId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<SingleEventParticipant> events = singleEventService.getEventsByUserId(userId, principal);
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    // ================ ADDITIONAL CONVENIENCE ENDPOINTS ================

    @Operation(summary = "Update event status only")
    @PatchMapping("/{id}/status")
    public ResponseEntity<SingleEvent> updateEventStatus(
            @PathVariable Long id,
            @RequestParam SingleEvent.SingleEventStatus status,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEvent updated = singleEventService.updateEventStatus(id, status, principal);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update max participants only")
    @PatchMapping("/{id}/max-participants")
    public ResponseEntity<SingleEvent> updateMaxParticipants(
            @PathVariable Long id,
            @RequestParam Integer maxParticipants,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SingleEvent updated = singleEventService.updateMaxParticipants(id, maxParticipants, principal);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Get event participant count")
    @GetMapping("/{eventId}/participants/count")
    public ResponseEntity<Integer> getParticipantCount(
            @PathVariable Long eventId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        int count = singleEventService.getParticipantCount(eventId);
        return ResponseEntity.ok(count);
    }
}