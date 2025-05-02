package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Coach;
import com.sporteventstournaments.domain.LPlayerCoach;
import com.sporteventstournaments.domain.dto.CoachDTO;
import com.sporteventstournaments.domain.dto.LPlayerCoachDTO;
import com.sporteventstournaments.exception.CoachNotFoundException;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.PlayerNotFoundException;
import com.sporteventstournaments.repository.CoachRepository;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.LPlayerCoachRepository;
import com.sporteventstournaments.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class CoachService {
    private final CoachRepository coachRepository;
    private final Coach coach;
    private final LPlayerCoach lPlayerCoach;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final LPlayerCoachRepository lPlayerCoachRepository;


    public List<Coach> getCoaches() {
        return coachRepository.findAll();
    }

    public Coach getCoach(Long id) {
        return coachRepository.findById(id).orElseThrow(CoachNotFoundException::new);
    }

    public void assignCoachToPlayer(LPlayerCoachDTO lPlayerCoachDTO){
        playerRepository.findById(lPlayerCoachDTO.getPlayerId()).orElseThrow(PlayerNotFoundException::new);
        coachRepository.findById(lPlayerCoachDTO.getPlayerId()).orElseThrow(CoachNotFoundException::new);
        int size = lPlayerCoachRepository.findAll().size();
        lPlayerCoach.setId((long) (size+1));
        lPlayerCoach.setCoachId(lPlayerCoachDTO.getCoachId());
        lPlayerCoach.setPlayerId(lPlayerCoachDTO.getPlayerId());
        lPlayerCoach.setSpecialization(lPlayerCoachDTO.getSpecialization());
        lPlayerCoachRepository.save(lPlayerCoach);
    }
    public void createCoach(CoachDTO coachDTO) {
        long teamId = coachDTO.getTeamId();
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        int size = coachRepository.findAll().size();
        coach.setId((long) (size+1));
        coach.setCoachName(coachDTO.getCoachName());
        coach.setBiography(coachDTO.getBiography());
        coach.setAchievements(coachDTO.getAchievements());
        coach.setTeamId(teamId);
        coachRepository.save(coach);
    }

    public void updateCoach(Coach coach) {
        coachRepository.saveAndFlush(coach);
    }

    @Transactional
    public void deleteCoachById(Long id){
        coachRepository.deleteById(id);
    }

    public List<LPlayerCoach> getLs() {
        return lPlayerCoachRepository.findAll();
    }

    public LPlayerCoach getL(Long id) {
        return lPlayerCoachRepository.findById(id).orElseThrow(CoachNotFoundException::new);
    }

    public void updateL(LPlayerCoach lPlayerCoach) {
        lPlayerCoachRepository.saveAndFlush(lPlayerCoach);
    }

    @Transactional
    public void deleteLById(Long id){
        lPlayerCoachRepository.deleteById(id);
    }

}