package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Team;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserTeamRelation;
import com.sporteventstournaments.domain.dto.TeamDTO;
import com.sporteventstournaments.domain.dto.TeamResponseDTO;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Tag(name = "Team Controller", description = "Makes all operations with Team")
@RestController
@RequestMapping("/team")
@AllArgsConstructor
@Slf4j
public class TeamController {
    private final TeamService teamService;
    private final SecurityService securityService;

    @Data
    public static class UserTeamRelationDTO{
        Long userId;
        Long teamId;
        Boolean acceptedInvite;
        String username;
        String position;
        String stats;
        String teamRole;
    }

    @Operation(summary = "get all Teams(for all)")
    @GetMapping
    public ResponseEntity<List<Team>> getTeams(Principal principal) {
        List<Team> teams = new ArrayList<>();
        if(principal != null)  teams = teamService.getTeams(principal);
        if (teams.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teams, HttpStatus.OK);
        }
    }

    @Operation(summary = "Get my Teams (for authenticated user)")
    @GetMapping("/my")
    public ResponseEntity<List<TeamResponseDTO>> getMyTeams(Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        List<TeamResponseDTO> teams = teamService.getMyTeams(principal);
        if (teams.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(teams, HttpStatus.OK);
        }
    }


    @Operation(summary = "get Team (for all)")
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeam(@PathVariable Long id) {
        Team team = teamService.getTeam(id);
        if (team != null) {
            return new ResponseEntity<>(team, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "create Team (for admins)")
    @PostMapping
    public ResponseEntity<HttpStatus> createTeam(@RequestBody TeamDTO teamDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return teamService.createTeam(teamDTO, principal);
    }


    @Operation(summary = "update Team (for authorized users)")
    @PutMapping()
    public ResponseEntity<HttpStatus> updateTeam(@RequestBody Team team, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return teamService.updateTeam(team, principal);
    }

    @Operation(summary = "delete Team (for authorized users)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteTeam(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            teamService.deleteTeamById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @GetMapping("/members")
    public ResponseEntity<List<UserTeamRelation>> getTeamMembers() {
        log.info("getTeamMembers");
        List<UserTeamRelation> userTeamRelations = teamService.getTeamMembers();
        if (userTeamRelations.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(userTeamRelations, HttpStatus.OK);
        }
    }

    @GetMapping("/members/team/{teamId}")
    public ResponseEntity<List<UserTeamRelation>> getTeamMembersForTeam(@PathVariable Long teamId) {
        List<UserTeamRelation> users = teamService.getTeamMembersForTeam(teamId);
        if (users.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(users, HttpStatus.OK);
        }
    }

    @GetMapping("/member/{id}")
    public ResponseEntity<UserTeamRelation> getTeamMember(@PathVariable Long id) {
        UserTeamRelation userTeamRelation = teamService.getTeamMember(id);
        if (userTeamRelation != null) {
            return new ResponseEntity<>(userTeamRelation, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/member")
    public ResponseEntity<HttpStatus> createTeamMember(@RequestBody UserTeamRelationDTO userTeamRelationDTO, Principal principal) {
        log.info("createTeamMember");
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return teamService.createTeamMember(userTeamRelationDTO, principal);
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<HttpStatus> deleteTeamMember(@PathVariable Long teamId,
                                                       @PathVariable Long userId, Principal principal) {
        log.info("deleteTeamMember");
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return teamService.deleteTeamMemberById(teamId, userId, principal);
    }

}
