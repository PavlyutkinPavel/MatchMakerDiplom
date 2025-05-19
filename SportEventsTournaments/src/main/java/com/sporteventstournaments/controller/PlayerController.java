package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Player;
import com.sporteventstournaments.domain.dto.PlayerDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.PlayerService;
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

@Tag(name = "Player Controller", description = "Makes all operations with players")
@RestController
@AllArgsConstructor
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService playerService;
    private final SecurityService securityService;

    @Operation(summary = "get all players(for all users)")
    @GetMapping
    public ResponseEntity<List<Player>> getPlayers() {
        List<Player> players = playerService.getPlayers();
        if (players.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(players, HttpStatus.OK);
        }
    }

    @Operation(summary = "get Player (for authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<Player> getPlayer(@PathVariable Long id) {
        Player player = playerService.getPlayer(id);
        if (player != null) {
            return new ResponseEntity<>(player, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "create player (for admins)")
    @PostMapping
    public ResponseEntity<HttpStatus> createPlayer(@RequestBody PlayerDTO playerDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            playerService.createPlayer(playerDTO);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

    }

    @Operation(summary = "update player (for  admins)")
    @PutMapping
    public ResponseEntity<HttpStatus> updatePlayer(@RequestBody Player player, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            playerService.updatePlayer(player);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete player (for admins)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deletePlayer(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            playerService.deletePlayerById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

}