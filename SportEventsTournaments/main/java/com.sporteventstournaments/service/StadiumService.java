package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Stadium;
import com.sporteventstournaments.domain.dto.StadiumDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.StadiumNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.StadiumRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StadiumService {
    private final StadiumRepository stadiumRepository;
    private final TeamRepository teamRepository;
    private final Stadium stadium;

    public List<Stadium> getStadiums() {
        return stadiumRepository.findAll();
    }

    public Stadium getStadium(Long id) {
        return stadiumRepository.findById(id).orElseThrow(StadiumNotFoundException::new);
    }
    public void createStadium(StadiumDTO stadiumDTO) {
        long teamId = stadiumDTO.getTeamId();
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        int size = stadiumRepository.findAll().size();
        stadium.setId((long) (size+1));
        stadium.setStadiumLocation(stadiumDTO.getStadiumLocation());
        stadium.setStadiumName(stadiumDTO.getStadiumName());
        stadium.setCapacity(stadiumDTO.getCapacity());
        stadium.setTeamId(teamId);
        stadiumRepository.save(stadium);
    }

    public void updateStadium(Stadium stadium) {
        stadiumRepository.saveAndFlush(stadium);
    }

    @Transactional
    public void deleteStadiumById(Long id){
        stadiumRepository.deleteById(id);
    }

}