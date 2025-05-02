package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.MatchResults;
import com.sporteventstournaments.domain.dto.MatchResultsDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.MatchResultNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.MatchResultsRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class MatchResultsService {
    private final MatchResultsRepository matchResultsRepository;
    private final TeamRepository teamRepository;
    private final MatchResults matchResults;

    public List<MatchResults> getMatchResults() {
        return matchResultsRepository.findAll();
    }

    public MatchResults getMatchResult(Long id) {
        return matchResultsRepository.findById(id).orElseThrow(MatchResultNotFoundException::new);
    }
    public void createMatchResults(MatchResultsDTO matchResultsDTO) {
        Long winnerID = matchResultsDTO.getWinnerId();
        teamRepository.findById(winnerID).orElseThrow(TeamNotFoundException::new);
        int size = matchResultsRepository.findAll().size();
        matchResults.setId((long) (size+1));
        matchResults.setDescription(matchResultsDTO.getDescription());
        matchResults.setFinalScore(matchResultsDTO.getFinal_score());
        matchResults.setWinnerId(winnerID);
        matchResultsRepository.save(matchResults);
    }

    public void updateMatchResults(MatchResults matchResults) {
        matchResultsRepository.findById(matchResults.getId()).orElseThrow(MatchResultNotFoundException::new);
        matchResultsRepository.saveAndFlush(matchResults);
    }

    @Transactional
    public void deleteMatchResultsById(Long id){
        matchResultsRepository.deleteById(id);
    }

}