package com.sporteventstournaments.controller.events;

import com.sporteventstournaments.domain.PlayoffEvent.PlayoffEventStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.sporteventstournaments.service.PlayOffEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;


@RestController
@RequestMapping("/playoff-events")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Playoff Events", description = "Playoff event management API")
public class PlayOffEventController {

    private final PlayOffEventService playoffEventService;

    @PostMapping
    @Operation(summary = "Create a new playoff event", description = "Creates a new playoff event with specified bracket size")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Playoff event created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data"),
            @ApiResponse(responseCode = "409", description = "Playoff event already exists for this event")
    })
    public ResponseEntity<PlayoffEventResponse> createPlayoffEvent(
            @Valid @RequestBody CreatePlayoffEventRequest request) {

        log.info("Creating playoff event for event ID: {}", request.getEventId());
        PlayoffEventResponse response = playoffEventService.createPlayoffEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get playoff event by ID", description = "Retrieves a playoff event by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Playoff event found"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found")
    })
    public ResponseEntity<PlayoffEventResponse> getPlayoffEvent(
            @Parameter(description = "Playoff event ID") @PathVariable Long id) {

        log.info("Fetching playoff event with ID: {}", id);
        PlayoffEventResponse response = playoffEventService.getPlayoffEvent(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @Operation(summary = "Get all playoff events", description = "Retrieves all playoff events with pagination")
    @ApiResponse(responseCode = "200", description = "Playoff events retrieved successfully")
    public ResponseEntity<Page<PlayoffEventResponse>> getAllPlayoffEvents(
            @PageableDefault(size = 20) Pageable pageable) {

        log.info("Fetching all playoff events");
        Page<PlayoffEventResponse> response = playoffEventService.getAllPlayoffEvents(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get playoff events by status", description = "Retrieves playoff events filtered by status")
    @ApiResponse(responseCode = "200", description = "Playoff events retrieved successfully")
    public ResponseEntity<List<PlayoffEventResponse>> getPlayoffEventsByStatus(
            @Parameter(description = "Playoff event status") @PathVariable PlayoffEventStatus status) {

        log.info("Fetching playoff events with status: {}", status);
        List<PlayoffEventResponse> response = playoffEventService.getPlayoffEventsByStatus(status);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update playoff event", description = "Updates an existing playoff event")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Playoff event updated successfully"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<PlayoffEventResponse> updatePlayoffEvent(
            @Parameter(description = "Playoff event ID") @PathVariable Long id,
            @Valid @RequestBody UpdatePlayoffEventRequest request) {

        log.info("Updating playoff event with ID: {}", id);
        PlayoffEventResponse response = playoffEventService.updatePlayoffEvent(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete playoff event", description = "Deletes a playoff event and its matches")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Playoff event deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found")
    })
    public ResponseEntity<Void> deletePlayoffEvent(
            @Parameter(description = "Playoff event ID") @PathVariable Long id) {

        log.info("Deleting playoff event with ID: {}", id);
        playoffEventService.deletePlayoffEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/start")
    @Operation(summary = "Start playoff event", description = "Changes playoff event status from DRAFT to ACTIVE")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Playoff event started successfully"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found"),
            @ApiResponse(responseCode = "400", description = "Cannot start playoff event in current status")
    })
    public ResponseEntity<Void> startPlayoffEvent(
            @Parameter(description = "Playoff event ID") @PathVariable Long id) {

        log.info("Starting playoff event with ID: {}", id);
        playoffEventService.startPlayoffEvent(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/complete")
    @Operation(summary = "Complete playoff event", description = "Changes playoff event status to COMPLETED")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Playoff event completed successfully"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found"),
            @ApiResponse(responseCode = "400", description = "Cannot complete playoff event with unfinished matches")
    })
    public ResponseEntity<Void> completePlayoffEvent(
            @Parameter(description = "Playoff event ID") @PathVariable Long id) {

        log.info("Completing playoff event with ID: {}", id);
        playoffEventService.completePlayoffEvent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/matches")
    @Operation(summary = "Get playoff matches", description = "Retrieves all matches for a playoff event")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Playoff matches retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "Playoff event not found")
    })
    public ResponseEntity<List<PlayoffMatchResponse>> getPlayoffMatches(
            @Parameter(description = "Playoff event ID") @PathVariable Long id) {

        log.info("Fetching playoff matches for event ID: {}", id);
        List<PlayoffMatchResponse> response = playoffEventService.getPlayoffMatches(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/matches/round/{round}")
    @Operation(summary = "Get playoff matches by round", description = "Retrieves matches for a specific round")
    @ApiResponse(responseCode = "200", description = "Playoff matches retrieved successfully")
    public ResponseEntity<List<PlayoffMatchResponse>> getPlayoffMatchesByRound(
            @Parameter(description = "Playoff event ID") @PathVariable Long id,
            @Parameter(description = "Round number") @PathVariable Integer round) {

        log.info("Fetching playoff matches for event ID: {} and round: {}", id, round);
        List<PlayoffMatchResponse> response = playoffEventService.getPlayoffMatchesByRound(id, round);
        return ResponseEntity.ok(response);
    }


    @Schema(description = "Request to create playoff event")
    @Data
    public static class CreatePlayoffEventRequest {

        @Schema(description = "Event ID to associate with playoff")
        @NotNull(message = "Event ID is required")
        private Long eventId;

        @Schema(description = "Bracket size (must be power of 2)", example = "8")
        @NotNull(message = "Bracket size is required")
        @Min(value = 2, message = "Bracket size must be at least 2")
        private Integer bracketSize;

        @Schema(description = "Initial status of playoff event")
        private PlayoffEventStatus status = PlayoffEventStatus.DRAFT;
    }

    @Schema(description = "Request to update playoff event")
    @Data
    public static class UpdatePlayoffEventRequest {

        @Schema(description = "New status of playoff event")
        private PlayoffEventStatus status;

        @Schema(description = "New bracket size")
        @Min(value = 2, message = "Bracket size must be at least 2")
        private Integer bracketSize;
    }

    @Schema(description = "Playoff event response")
    @Data
    public static class PlayoffEventResponse {

        @Schema(description = "Playoff event ID")
        private Long id;

        @Schema(description = "Associated event information")
        private EventSummaryDto event;

        @Schema(description = "Current status")
        private PlayoffEventStatus status;

        @Schema(description = "Bracket size")
        private Integer bracketSize;

        @Schema(description = "Number of matches")
        private Integer totalMatches;

        @Schema(description = "Number of completed matches")
        private Integer completedMatches;
    }

    @Schema(description = "Event summary information")
    @Data
    public static class EventSummaryDto {
        private Long id;
        private String name;
        private String description;
    }

    @Schema(description = "Playoff match response")
    @Data
    public static class PlayoffMatchResponse {

        @Schema(description = "Event ID")
        private Long eventId;

        @Schema(description = "Match number")
        private Integer matchNumber;

        @Schema(description = "Round number")
        private Integer round;

        @Schema(description = "Team 1 ID")
        private Long team1Id;

        @Schema(description = "Team 2 ID")
        private Long team2Id;

        @Schema(description = "Team 1 score")
        private Integer team1Score;

        @Schema(description = "Team 2 score")
        private Integer team2Score;

        @Schema(description = "Winner team ID")
        private Long winnerTeamId;

        @Schema(description = "Match start time")
        private LocalDateTime matchStartTime;
    }
}
