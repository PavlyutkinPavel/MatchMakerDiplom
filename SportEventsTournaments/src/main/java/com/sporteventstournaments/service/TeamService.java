package com.sporteventstournaments.service;

import com.sporteventstournaments.controller.TeamController;
import com.sporteventstournaments.domain.Team;
import com.sporteventstournaments.domain.TeamType;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.UserTeamRelation;
import com.sporteventstournaments.domain.dto.TeamDTO;
import com.sporteventstournaments.domain.dto.TeamResponseDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.repository.UserTeamRelationRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TeamService {
    private static final Logger log = LoggerFactory.getLogger(TeamService.class);
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final UserTeamRelationRepository userTeamRelationRepository;
    private final SecurityService securityService;
    private Team team;
    private UserTeamRelation userTeamRelation;
    private User user;

    public List<Team> getTeams(Principal principal) {
        return teamRepository.findAll();
        /*if(securityService.checkIfAdmin(principal.getName())){
            return teamRepository.findAll();
        } else{
            User user = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
            List<Long> teamIds = userTeamRelationRepository.findAllTeamsByUserId(user.getId());
            return teamRepository.findAllById(teamIds);
        }*/
    }

    public List<TeamResponseDTO> getMyTeams(Principal principal) {
        User user = userRepository.findByUserLogin(principal.getName())
                .orElseThrow(UserNotFoundException::new);
        List<Team> teams = userTeamRelationRepository.findAllTeamsByUserId(user.getId());

        List<TeamResponseDTO> dtoList = new ArrayList<>();
        for (Team team : teams) {
            TeamResponseDTO dto = new TeamResponseDTO(
                    team.getId(),
                    team.getTeamName(),
                    team.getCountry(),
                    team.getCity(),
                    team.getAchievements(),
                    team.getStatus(),
                    team.getWins(),
                    team.getTeamType(),
                    team.getCreatorId(),
                    team.getDirectorId()
            );
            dtoList.add(dto);
        }
        return dtoList;
    }

    public Team getTeam(Long id) {
        return teamRepository.findById(id).orElseThrow(TeamNotFoundException::new);
    }
    public ResponseEntity<HttpStatus> createTeam(TeamDTO teamDTO, Principal principal) {
        User creator = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
//        UserTeamRelation userTeamRelation = userTeamRelationRepository.findAllBy*/
        int size = teamRepository.findAll().size();
        team.setId((long) (size+1));
        team.setTeamName(teamDTO.getTeamName());
        team.setTeamType(TeamType.valueOf(teamDTO.getTeamType().toUpperCase()));
        team.setCountry(teamDTO.getCountry());
        team.setCity(teamDTO.getCity());
        team.setStatus(teamDTO.getStatus());
        team.setAchievements(teamDTO.getAchievements());
        team.setWins(teamDTO.getWins());
        team.setCreatorId(creator.getId());
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

    public List<UserTeamRelation> getTeamMembersForTeam(Long teamId) {

        List<UserTeamRelation> userTeamRelationList =  userTeamRelationRepository.findAllUsersByTeamId(teamId);
        System.out.println(userTeamRelationList);
        return userTeamRelationList;
    }

    public UserTeamRelation getTeamMember(Long id) {
        return userTeamRelationRepository.findById(id).orElseThrow(UserNotFoundException::new);
    }

    public ResponseEntity<HttpStatus> createTeamMember(TeamController.UserTeamRelationDTO userTeamRelationDTO, Principal principal) {
        team = teamRepository.findById(userTeamRelationDTO.getTeamId()).orElseThrow(TeamNotFoundException::new);
        user = userRepository.findById(userTeamRelationDTO.getUserId()).orElseThrow(UserNotFoundException::new);
        userTeamRelation.setTeamId(userTeamRelationDTO.getTeamId());
        userTeamRelation.setUserId(userTeamRelationDTO.getUserId());
        userTeamRelation.setAcceptedInvite(userTeamRelationDTO.getAcceptedInvite());
        userTeamRelation.setUsername(userTeamRelationDTO.getUsername());
        userTeamRelation.setPosition(userTeamRelationDTO.getPosition());
        userTeamRelation.setStats(userTeamRelationDTO.getStats());
        userTeamRelation.setTeamRole(UserTeamRelation.TeamRole.valueOf(userTeamRelationDTO.getTeamRole()));
        log.info(String.valueOf(userTeamRelation));
        userTeamRelationRepository.save(userTeamRelation);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Transactional
    public ResponseEntity<HttpStatus> deleteTeamMemberById(Long teamId, Long userId, Principal principal){
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Team team = teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        if (team.getCreatorId() != currentUser.getId()) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }else{
            log.info("deleteUserTeamRelationByUserIdAndTeamId");
            userTeamRelationRepository.deleteUserTeamRelationByUserIdAndTeamId(userId, teamId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

}