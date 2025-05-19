package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Coach;
import com.sporteventstournaments.domain.dto.CoachDTO;
import com.sporteventstournaments.domain.dto.LPlayerCoachDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.CoachService;
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

@Tag(name = "Coach Controller", description = "Makes all operations with coaches")
@RestController
@AllArgsConstructor
@RequestMapping("/coach")
public class CoachController {
    private final CoachService coachService;
    private final SecurityService securityService;

    @Operation(summary = "get all coaches(for all users)")
    @GetMapping
    public ResponseEntity<List<Coach>> getCoaches() {
        List<Coach> coaches = coachService.getCoaches();
        if (coaches.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(coaches, HttpStatus.OK);
        }
    }

    @Operation(summary = "get coach (for all users)")
    @GetMapping("/{id}")
    public ResponseEntity<Coach> getCoach(@PathVariable Long id) {
        Coach coach = coachService.getCoach(id);
        if (coach != null) {
            return new ResponseEntity<>(coach, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //maybe should be deleted(or only for admins)
    @Operation(summary = "create coach (for authorized users)")
    @PostMapping
    public ResponseEntity<HttpStatus> createCoach(@RequestBody CoachDTO coachDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            coachService.createCoach(coachDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "create coach-player pair (for admins)")
    @PostMapping("/assign")
    public ResponseEntity<HttpStatus> assignCoachToPlayer(@RequestBody LPlayerCoachDTO lPlayerCoachDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            coachService.assignCoachToPlayer(lPlayerCoachDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }


    @Operation(summary = "update coach (for authorized users)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateCoach(@RequestBody Coach coach, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            coachService.updateCoach(coach);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete coach (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteCoach(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            coachService.deleteCoachById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
