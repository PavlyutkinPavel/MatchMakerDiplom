package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Fan;
import com.sporteventstournaments.domain.dto.FanDTO;
import com.sporteventstournaments.exception.FanNotFoundException;
import com.sporteventstournaments.repository.FanRepository;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.UserRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class FanService {
    private final FanRepository fanRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;

    private final SecurityService securityService;

    private final Fan fan;

    public List<Fan> getFans() {
        return fanRepository.findAll();
    }

    public Fan getFan(Long id) {
        return fanRepository.findById(id).orElseThrow(FanNotFoundException::new);
    }
    public void createFan(FanDTO fanDTO, Principal principal) {
        fan.setUserId(securityService.getUserIdByLogin(principal.getName()));
        int size = fanRepository.findAll().size();
        fan.setId((long) (size+1));
        fan.setTeamId(fanDTO.getTeamId());
        fanRepository.save(fan);
    }

    public void updateFan(Fan fan) {
        fanRepository.saveAndFlush(fan);
    }

    @Transactional
    public void deleteFanById(Long id){
        fanRepository.deleteById(id);
    }

}