package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.MatchSchedule;
import com.sporteventstournaments.domain.dto.MatchScheduleDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.MatchScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@Tag(name = "MatchSchedule Controller", description = "Makes all operations with MatchSchedule")
@RestController
@AllArgsConstructor
@RequestMapping("/matchSchedule")
public class MatchScheduleController {

    private final MatchScheduleService matchScheduleService;
    private final SecurityService securityService;

    @Operation(summary = "get all MatchSchedule(for all users)")
    @GetMapping
    public ResponseEntity<List<MatchSchedule>> getMatchSchedules() {
        List<MatchSchedule> matchSchedules = matchScheduleService.getMatchSchedules();
        if (matchSchedules.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(matchSchedules, HttpStatus.OK);
        }
    }

    @Operation(summary = "get MatchSchedule (for all users)")
    @GetMapping("/{id}")
    public ResponseEntity<MatchSchedule> getMatchSchedule(@PathVariable Long id) {
        MatchSchedule matchSchedule = matchScheduleService.getMatchSchedule(id);
        if (matchSchedule != null) {
            return new ResponseEntity<>(matchSchedule, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "create MatchSchedule (for admin)")
    @PostMapping
    public ResponseEntity<HttpStatus> createMatchSchedule(@RequestBody MatchScheduleDTO matchScheduleDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchScheduleService.createMatchSchedule(matchScheduleDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @Operation(summary = "update MatchSchedule (for admin)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateMatchSchedule(@RequestBody MatchSchedule matchSchedule, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchScheduleService.updateMatchSchedule(matchSchedule);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete MatchSchedule (for admin)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMatchSchedule(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchScheduleService.deleteMatchScheduleById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
