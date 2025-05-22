package com.sporteventstournaments.controller.events;


import com.sporteventstournaments.domain.TwoTeamEvent;
import com.sporteventstournaments.domain.dto.TwoTeamEventDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.TwoTeamEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Tag(name = "Two Team Event Controller", description = "Operations related to two-team events")
@RestController
@AllArgsConstructor
@RequestMapping("/two-team-event")
public class TwoTeamEventController {

    private final TwoTeamEventService twoTeamEventService;
    private final SecurityService securityService;

    @Operation(summary = "Get all two-team events")
    @GetMapping
    public ResponseEntity<List<TwoTeamEvent>> getAllTwoTeamEvents(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TwoTeamEvent> events = twoTeamEventService.getAllTwoTeamEvents();
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Get two-team event by ID")
    @GetMapping("/{id}")
    public ResponseEntity<TwoTeamEvent> getTwoTeamEventById(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TwoTeamEvent event = twoTeamEventService.getTwoTeamEventById(id);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @Operation(summary = "Get two-team events by status")
    @GetMapping("/status")
    public ResponseEntity<List<TwoTeamEvent>> getByStatus(@RequestParam TwoTeamEvent.TwoTeamEventStatus status,
                                                          Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TwoTeamEvent> events = twoTeamEventService.getTwoTeamEventsByStatus(status);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Get two-team events by team ID")
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TwoTeamEvent>> getByTeamId(@PathVariable Long teamId, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<TwoTeamEvent> events = twoTeamEventService.getTwoTeamEventsByTeamId(teamId);
        if (events.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @Operation(summary = "Create a new two-team event (event creator or admin only)")
    @PostMapping
    public ResponseEntity<TwoTeamEvent> create(@RequestBody TwoTeamEventDTO dto, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TwoTeamEvent created = twoTeamEventService.createTwoTeamEvent(dto, principal);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Update a two-team event (event creator or admin only)")
    @PutMapping("/{id}")
    public ResponseEntity<TwoTeamEvent> update(@PathVariable Long id,
                                               @RequestBody TwoTeamEventDTO dto,
                                               Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TwoTeamEvent updated = twoTeamEventService.updateTwoTeamEvent(id, dto, principal);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @Operation(summary = "Delete a two-team event (event creator or admin only)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> delete(@PathVariable Long id, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        twoTeamEventService.deleteTwoTeamEvent(id, principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Update scores of a two-team event (event creator or admin only)")
    @PutMapping("/{id}/scores")
    public ResponseEntity<TwoTeamEvent> updateScores(@PathVariable Long id,
                                                     @RequestParam Integer team1Score,
                                                     @RequestParam Integer team2Score,
                                                     Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        TwoTeamEvent updated = twoTeamEventService.updateScores(id, team1Score, team2Score, principal);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}
