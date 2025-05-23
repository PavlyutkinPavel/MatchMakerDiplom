package com.sporteventstournaments.controller.events;

import com.sporteventstournaments.domain.SingleEvent;
import com.sporteventstournaments.domain.TableEvent;
import com.sporteventstournaments.domain.TableEventTeam;
import com.sporteventstournaments.domain.dto.TableEventDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.TableEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(name = "Table Event Controller", description = "Operations related to table events and their teams")
@RestController
@AllArgsConstructor
@RequestMapping("/table-event")
public class TableEventController {

    private final TableEventService tableEventService;


    // ================ REQUEST DTOs ================

    @Data
    public static class CreateTableEventRequest {
        private Long eventId;
        private Integer maxTeams;
        private List<Long> teamsIds;
    }

    @Data
    public static class UpdateTableEventRequest {
        private Integer maxTeams;
        private TableEvent.TableEventStatus status;
    }

    @Data
    public static class AddParticipantsRequest {
        private List<Long> teamsIds;
    }

    @Operation(summary = "Get all table events")
    @GetMapping
    public ResponseEntity<List<TableEvent>> getAllTableEvents(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TableEvent> events = tableEventService.getAllTableEvents();
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Get table event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TableEvent> getTableEventById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEvent event = tableEventService.getTableEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @Operation(summary = "Get table events by status")
    @GetMapping("/status")
    public ResponseEntity<List<TableEvent>> getByStatus(@RequestParam TableEvent.TableEventStatus status,
                                                        Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TableEvent> events = tableEventService.getTableEventsByStatus(status);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Create a table event (event creator or admin only)")
    @PostMapping
    public ResponseEntity<TableEvent> create(@RequestBody CreateTableEventRequest dto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEvent created = tableEventService.createTableEvent(
                dto.getEventId(),
                dto.getMaxTeams(),
                dto.getTeamsIds(),
                principal
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @Operation(summary = "Update a table event (event creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<TableEvent> update(@PathVariable Long id,
                                             @RequestBody UpdateTableEventRequest request,
                                             Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        TableEvent updated = tableEventService.updateTableEvent(
                id,
                request.getMaxTeams(),
                request.getStatus(),
                principal
        );
        return ResponseEntity.ok(updated);
    }

    @Operation(summary = "Delete a table event (event creator or admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        tableEventService.deleteTableEvent(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Add a team to a table event")
    @PostMapping("/{eventId}/team/{teamId}")
    public ResponseEntity<TableEventTeam> addTeam(@PathVariable Long eventId,
                                                  @PathVariable Long teamId,
                                                  Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEventTeam team = tableEventService.addTeam(eventId, teamId, principal);
        return new ResponseEntity<>(team, HttpStatus.CREATED);
    }

    @Operation(summary = "Remove a team from a table event")
    @DeleteMapping("/{eventId}/team/{teamId}")
    public ResponseEntity<HttpStatus> removeTeam(@PathVariable Long eventId,
                                                 @PathVariable Long teamId,
                                                 Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        tableEventService.removeTeam(eventId, teamId, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Get teams in a table event")
    @GetMapping("/{eventId}/teams")
    public ResponseEntity<List<TableEventTeam>> getTeams(@PathVariable Long eventId,
                                                         Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TableEventTeam> teams = tableEventService.getTeamsByEventId(eventId);
        if (teams.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(teams, HttpStatus.OK);
    }

    @Operation(summary = "Get table events a team participates in")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TableEventTeam>> getTeamEvents(@PathVariable Long teamId,
                                                              Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TableEventTeam> events = tableEventService.getEventsByTeamId(teamId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Update stats of a team in a table event")
    @PutMapping("/{eventId}/team/{teamId}/stats")
    public ResponseEntity<TableEventTeam> updateTeamStats(@PathVariable Long eventId,
                                                          @PathVariable Long teamId,
                                                          @RequestParam Integer points,
                                                          @RequestParam Integer wins,
                                                          @RequestParam Integer losses,
                                                          @RequestParam Integer draws,
                                                          Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEventTeam updated = tableEventService.updateTeamStats(eventId, teamId, points, wins, losses, draws, principal);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
