package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.MatchResults;
import com.sporteventstournaments.domain.dto.MatchResultsDTO;
import com.sporteventstournaments.exception.MatchResultNotFoundException;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.MatchResultsService;
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

@Tag(name = "MatchResults Controller", description = "Makes all operations with MatchResults")
@RestController
@AllArgsConstructor
@RequestMapping("/matchResults")
public class MatchResultsController {

    private final MatchResultsService matchResultsService;
    private final SecurityService securityService;

    @Operation(summary = "get all MatchResults(for all users)")
    @GetMapping
    public ResponseEntity<List<MatchResults>> getMatchResults() {
        List<MatchResults> matchResults = matchResultsService.getMatchResults();
        if (matchResults.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(matchResults, HttpStatus.OK);
        }
    }

    @Operation(summary = "get MatchResult (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<MatchResults> getMatchResult(@PathVariable Long id) {
        MatchResults matchResults = matchResultsService.getMatchResult(id);
        if (matchResults != null) {
            return new ResponseEntity<>(matchResults, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    //maybe should be deleted(or only for admins)
    @Operation(summary = "create MatchResults (for admins)")
    @PostMapping
    public ResponseEntity<HttpStatus> createMatchResults(@RequestBody MatchResultsDTO matchResultsDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchResultsService.createMatchResults(matchResultsDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        }else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }


    @Operation(summary = "update MatchResults (for authorized users)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateMatchResults(@RequestBody MatchResults matchResults, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchResultsService.updateMatchResults(matchResults);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete MatchResults (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteMatchResults(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            matchResultsService.deleteMatchResultsById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
