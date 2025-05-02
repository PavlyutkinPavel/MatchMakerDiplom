package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Stadium;
import com.sporteventstournaments.domain.dto.StadiumDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.StadiumService;
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

@Tag(name = "Stadium Controller", description = "Makes all operations with Stadium")
@RestController
@AllArgsConstructor
@RequestMapping("/stadium")
public class StadiumController {

    private final StadiumService stadiumService;
    private final SecurityService securityService;

    @Operation(summary = "get all Stadium(for all users)")
    @GetMapping
    public ResponseEntity<List<Stadium>> getStadiumList() {
        List<Stadium> stadiums = stadiumService.getStadiums();
        if (stadiums.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(stadiums, HttpStatus.OK);
        }
    }

    @Operation(summary = "get Stadium (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<Stadium> getStadium(@PathVariable Long id) {
        Stadium stadium = stadiumService.getStadium(id);
        if (stadium != null) {
            return new ResponseEntity<>(stadium, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "create Stadium (for admins)")
    @PostMapping
    public ResponseEntity<HttpStatus> createStadium(@RequestBody StadiumDTO stadiumDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            stadiumService.createStadium(stadiumDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }


    @Operation(summary = "update Stadium (for authorized users)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateStadium(@RequestBody Stadium stadium, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            stadiumService.updateStadium(stadium);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete Stadium (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteStadium(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            stadiumService.deleteStadiumById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}
