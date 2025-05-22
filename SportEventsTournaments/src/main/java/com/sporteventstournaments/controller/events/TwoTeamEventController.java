package com.sporteventstournaments.controller.events;

import com.sporteventstournaments.domain.TwoTeamEvent;
import com.sporteventstournaments.service.TwoTeamEventService;
import com.sporteventstournaments.exception.EventNotFoundException;
import com.sporteventstournaments.exception.ForbiddenOperationException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.security.Principal;
import java.util.List;

@Tag(name = "Two Team Event Controller", description = "Operations related to two-team events")
@RestController
@AllArgsConstructor
@RequestMapping("/two-team-event")
public class TwoTeamEventController {

    private final TwoTeamEventService twoTeamEventService;

    // ================ REQUEST DTOs ================

    @Data
    public static class CreateTwoTeamEventRequest {
        @NotNull(message = "Event ID is required")
        private Long eventId;

        @NotNull(message = "Team 1 ID is required")
        private Long team1Id;

        @NotNull(message = "Team 2 ID is required")
        private Long team2Id;

        @Override
        public String toString() {
            return "CreateTwoTeamEventRequest{" +
                    "eventId=" + eventId +
                    ", team1Id=" + team1Id +
                    ", team2Id=" + team2Id +
                    '}';
        }
    }

    @Data
    public static class UpdateTwoTeamEventRequest {
        private Long team1Id;
        private Long team2Id;
        private TwoTeamEvent.TwoTeamEventStatus status;
    }

    @Data
    public static class UpdateScoresRequest {
        @NotNull(message = "Team 1 score is required")
        @Min(value = 0, message = "Score cannot be negative")
        private Integer team1Score;

        @NotNull(message = "Team 2 score is required")
        @Min(value = 0, message = "Score cannot be negative")
        private Integer team2Score;
    }

    @Data
    public static class UpdateTeamsRequest {
        @NotNull(message = "Team 1 ID is required")
        private Long team1Id;

        @NotNull(message = "Team 2 ID is required")
        private Long team2Id;
    }

    @Data
    public static class BatchEventIdsRequest {
        @NotNull(message = "Event IDs list is required")
        private List<Long> eventIds;
    }

    // ================ DEBUG ENDPOINT ================

    @Operation(summary = "Create two-team event with detailed error info (for debugging)")
    @PostMapping("/debug")
    public ResponseEntity<?> createTwoTeamEventDebug(
            @RequestBody(required = false) CreateTwoTeamEventRequest request,
            Principal principal) {

        try {
            // Детальная диагностика
            StringBuilder debug = new StringBuilder("Debug info:\n");
            debug.append("Principal: ").append(principal != null ? principal.getName() : "null").append("\n");
            debug.append("Request body: ").append(request != null ? request.toString() : "null").append("\n");

            if (request != null) {
                debug.append("EventId: ").append(request.getEventId()).append("\n");
                debug.append("Team1Id: ").append(request.getTeam1Id()).append("\n");
                debug.append("Team2Id: ").append(request.getTeam2Id()).append("\n");
            }

            System.out.println(debug.toString());

            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication required. Debug: " + debug.toString());
            }

            if (request == null) {
                return ResponseEntity.badRequest()
                        .body("Request body is null. Debug: " + debug.toString());
            }

            // Валидация
            if (request.getEventId() == null) {
                return ResponseEntity.badRequest()
                        .body("Event ID is required. Debug: " + debug.toString());
            }
            if (request.getTeam1Id() == null) {
                return ResponseEntity.badRequest()
                        .body("Team 1 ID is required. Debug: " + debug.toString());
            }
            if (request.getTeam2Id() == null) {
                return ResponseEntity.badRequest()
                        .body("Team 2 ID is required. Debug: " + debug.toString());
            }

            TwoTeamEvent created = twoTeamEventService.createTwoTeamEvent(
                    request.getEventId(),
                    request.getTeam1Id(),
                    request.getTeam2Id(),
                    principal
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage() + "\nStack trace: " + java.util.Arrays.toString(e.getStackTrace()));
        }
    }

    // ================ MAIN ENDPOINTS ================

    @Operation(summary = "Get all two-team events")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved events"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "No events found")
    })
    @GetMapping
    public ResponseEntity<List<TwoTeamEvent>> getAllTwoTeamEvents(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TwoTeamEvent> events = twoTeamEventService.getAllTwoTeamEvents();
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Get two-team event by event ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Event found"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    @GetMapping("/{eventId}")
    public ResponseEntity<TwoTeamEvent> getTwoTeamEventById(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent event = twoTeamEventService.getTwoTeamEventById(eventId);
        return ResponseEntity.ok(event);
    }

    @Operation(summary = "Create a new two-team event (event creator or admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Event created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions"),
            @ApiResponse(responseCode = "409", description = "Two-team event already exists for this event")
    })
    @PostMapping
    public ResponseEntity<?> createTwoTeamEvent(
            @RequestBody CreateTwoTeamEventRequest request,
            Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication required");
            }

            // Валидация входных данных
            if (request.getEventId() == null) {
                return ResponseEntity.badRequest().body("Event ID is required");
            }
            if (request.getTeam1Id() == null) {
                return ResponseEntity.badRequest().body("Team 1 ID is required");
            }
            if (request.getTeam2Id() == null) {
                return ResponseEntity.badRequest().body("Team 2 ID is required");
            }

            TwoTeamEvent created = twoTeamEventService.createTwoTeamEvent(
                    request.getEventId(),
                    request.getTeam1Id(),
                    request.getTeam2Id(),
                    principal
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        } catch (ForbiddenOperationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EventNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    @Operation(summary = "Create two-team event with path variables (for testing)")
    @PostMapping("/create/{eventId}/{team1Id}/{team2Id}")
    public ResponseEntity<?> createTwoTeamEventByPath(
            @PathVariable Long eventId,
            @PathVariable Long team1Id,
            @PathVariable Long team2Id,
            Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication required");
            }

            TwoTeamEvent created = twoTeamEventService.createTwoTeamEvent(eventId, team1Id, team2Id, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        } catch (ForbiddenOperationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EventNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    @Operation(summary = "Create two-team event by IDs (simplified)")
    @PostMapping("/simple")
    public ResponseEntity<?> createTwoTeamEventSimple(
            @Parameter(description = "Event ID") @RequestParam Long eventId,
            @Parameter(description = "Team 1 ID") @RequestParam Long team1Id,
            @Parameter(description = "Team 2 ID") @RequestParam Long team2Id,
            Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Authentication required");
            }

            TwoTeamEvent created = twoTeamEventService.createTwoTeamEvent(eventId, team1Id, team2Id, principal);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        } catch (ForbiddenOperationException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EventNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Internal server error: " + e.getMessage());
        }
    }

    @Operation(summary = "Update a two-team event (event creator or admin only)")
    @PutMapping("/{eventId}")
    public ResponseEntity<TwoTeamEvent> updateTwoTeamEvent(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @RequestBody UpdateTwoTeamEventRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateTwoTeamEvent(
                eventId,
                request.getTeam1Id(),
                request.getTeam2Id(),
                request.getStatus(),
                principal
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a two-team event (event creator or admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Event deleted successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - insufficient permissions"),
            @ApiResponse(responseCode = "404", description = "Event not found")
    })
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteTwoTeamEvent(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        twoTeamEventService.deleteTwoTeamEvent(eventId, principal);
        return ResponseEntity.noContent().build();
    }

    // ================ QUERY ENDPOINTS ================

    @Operation(summary = "Get two-team events by status")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<TwoTeamEvent>> getByStatus(
            @Parameter(description = "Event status") @PathVariable TwoTeamEvent.TwoTeamEventStatus status,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TwoTeamEvent> events = twoTeamEventService.getTwoTeamEventsByStatus(status);
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Get active two-team events (PENDING or SCHEDULED)")
    @GetMapping("/active")
    public ResponseEntity<List<TwoTeamEvent>> getActiveTwoTeamEvents(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TwoTeamEvent> events = twoTeamEventService.getActiveTwoTeamEvents();
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Get two-team events by team ID")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TwoTeamEvent>> getByTeamId(
            @Parameter(description = "Team ID") @PathVariable Long teamId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TwoTeamEvent> events = twoTeamEventService.getTwoTeamEventsByTeamId(teamId);
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    @Operation(summary = "Get multiple two-team events by event IDs")
    @PostMapping("/batch")
    public ResponseEntity<List<TwoTeamEvent>> getTwoTeamEventsByEventIds(
            @RequestBody BatchEventIdsRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<TwoTeamEvent> events = twoTeamEventService.getTwoTeamEventsByEventIds(request.getEventIds());
        if (events.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(events);
    }

    // ================ CONVENIENCE ENDPOINTS ================

    @Operation(summary = "Check if two-team event exists for given event ID")
    @GetMapping("/{eventId}/exists")
    public ResponseEntity<Boolean> checkTwoTeamEventExists(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean exists = twoTeamEventService.existsTwoTeamEvent(eventId);
        return ResponseEntity.ok(exists);
    }

    @Operation(summary = "Update event status only")
    @PatchMapping("/{eventId}/status")
    public ResponseEntity<TwoTeamEvent> updateEventStatus(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @Parameter(description = "New status") @RequestParam TwoTeamEvent.TwoTeamEventStatus status,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateStatus(eventId, status, principal);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update teams only")
    @PatchMapping("/{eventId}/teams")
    public ResponseEntity<TwoTeamEvent> updateTeams(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @RequestBody UpdateTeamsRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateTwoTeamEvent(
                eventId,
                request.getTeam1Id(),
                request.getTeam2Id(),
                null,
                principal
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update teams only (query params)")
    @PatchMapping("/{eventId}/teams/simple")
    public ResponseEntity<TwoTeamEvent> updateTeamsSimple(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @Parameter(description = "Team 1 ID") @RequestParam Long team1Id,
            @Parameter(description = "Team 2 ID") @RequestParam Long team2Id,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateTwoTeamEvent(eventId, team1Id, team2Id, null, principal);
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update scores with request body")
    @PutMapping("/{eventId}/scores")
    public ResponseEntity<TwoTeamEvent> updateScores(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @RequestBody UpdateScoresRequest request,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateScores(
                eventId,
                request.getTeam1Score(),
                request.getTeam2Score(),
                principal
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Update scores (query params)")
    @PutMapping("/{eventId}/scores/simple")
    public ResponseEntity<TwoTeamEvent> updateScoresSimple(
            @Parameter(description = "Event ID") @PathVariable Long eventId,
            @Parameter(description = "Team 1 score") @RequestParam @Min(0) Integer team1Score,
            @Parameter(description = "Team 2 score") @RequestParam @Min(0) Integer team2Score,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TwoTeamEvent updated = twoTeamEventService.updateScores(eventId, team1Score, team2Score, principal);
        return ResponseEntity.ok(updated);
    }
}