package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Team;
import com.sporteventstournaments.domain.TeamType;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserTeamRelation;
import com.sporteventstournaments.domain.dto.TeamDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.repository.UserTeamRelationRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserTeamRelationRepository userTeamRelationRepository;
    private final SecurityService securityService;
    private final Team team;

    public List<Team> getTeams(Principal principal) {
        if(securityService.checkIfAdmin(principal.getName())){
            return teamRepository.findAll();
        } else{
            User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
            List<Long> teamIds = userTeamRelationRepository.findAllTeamsByUserId(user.getId());
            return teamRepository.findAllById(teamIds);
        }

    }
    public Team getTeam(Long id) {
        return teamRepository.findById(id).orElseThrow(TeamNotFoundException::new);
    }
    public ResponseEntity<HttpStatus> createTeam(TeamDTO teamDTO, Principal principal) {
        /*creator = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        UserTeamRelation userTeamRelation = userTeamRelationRepository.findAllBy*/
        int size = teamRepository.findAll().size();
        team.setId((long) (size+1));
        team.setTeamName(teamDTO.getTeamName());
        team.setTeamType(TeamType.valueOf(teamDTO.getTeamType().toUpperCase()));
        team.setCountry(teamDTO.getCountry());
        team.setCountry(teamDTO.getCity());
        team.setStatus(teamDTO.getStatus());
        team.setAchievements(teamDTO.getAchievements());
        team.setWins(teamDTO.getWins());
        teamRepository.save(team);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    public ResponseEntity<HttpStatus> updateTeam(Team team, Principal principal) {
        teamRepository.saveAndFlush(team);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @Transactional
    public void deleteTeamById(Long id){
        teamRepository.deleteById(id);
    }

    public List<UserTeamRelation> getTeamMembers() {
        return userTeamRelationRepository.findAll();
    }

    public UserTeamRelation getTeamMember(Long id) {
        return userTeamRelationRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public ResponseEntity<HttpStatus> createTeamMember(UserTeamRelation userTeamRelation, Principal principal) {
        userTeamRelationRepository.save(userTeamRelation);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<HttpStatus> deleteTeamMemberById(Long id, Long teamId, Principal principal){
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        if (team.getCreatorId() != currentUser.getId()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }else{
            userTeamRelationRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

}