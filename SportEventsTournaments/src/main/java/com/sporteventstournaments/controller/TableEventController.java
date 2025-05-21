package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.TableEvent;
import com.sporteventstournaments.domain.TableEventTeam;
import com.sporteventstournaments.domain.dto.TableEventDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.TableEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
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
    private final SecurityService securityService;

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
    public ResponseEntity<TableEvent> create(@RequestBody TableEventDTO dto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEvent created = tableEventService.createTableEvent(dto, principal);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Update a table event (event creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<TableEvent> update(@PathVariable Long id,
                                             @RequestBody TableEventDTO dto,
                                             Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TableEvent updated = tableEventService.updateTableEvent(id, dto, principal);
        return new ResponseEntity<>(updated, HttpStatus.OK);
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
