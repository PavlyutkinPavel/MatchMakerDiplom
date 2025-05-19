package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.MatchSchedule;
import com.sporteventstournaments.domain.dto.MatchScheduleDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.MatchScheduleNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.MatchScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MatchScheduleService {
    private final MatchScheduleRepository matchScheduleRepository;
    private final TeamRepository teamRepository;
    private final MatchSchedule matchSchedule;

    public List<MatchSchedule> getMatchSchedules() {
        return matchScheduleRepository.findAll();
    }

    public MatchSchedule getMatchSchedule(Long id) {
        return matchScheduleRepository.findById(id).orElseThrow(MatchScheduleNotFoundException::new);
    }
    public void createMatchSchedule(MatchScheduleDTO matchScheduleDTO) {
        teamRepository.findById(matchScheduleDTO.getHomeTeam()).orElseThrow(TeamNotFoundException::new);
        teamRepository.findById(matchScheduleDTO.getAwayTeam()).orElseThrow(TeamNotFoundException::new);
        int size = matchScheduleRepository.findAll().size();
        matchSchedule.setId((long) (size+1));
        matchSchedule.setMatchDate(matchScheduleDTO.getMatch_date());
        matchSchedule.setMatchLocation(matchScheduleDTO.getMatch_location());
        matchSchedule.setHomeTeam(matchScheduleDTO.getHomeTeam());
        matchSchedule.setAwayTeam(matchScheduleDTO.getAwayTeam());
        matchSchedule.setAvailableTickets(matchScheduleDTO.getAvailable_tickets());
        matchScheduleRepository.save(matchSchedule);
    }
    public void updateMatchSchedule(MatchSchedule matchSchedule) {
        matchScheduleRepository.findById(matchSchedule.getId()).orElseThrow(MatchScheduleNotFoundException::new);
        matchScheduleRepository.saveAndFlush(matchSchedule);
    }

    @Transactional
    public void deleteMatchScheduleById(Long id){
        matchScheduleRepository.deleteById(id);
    }

}