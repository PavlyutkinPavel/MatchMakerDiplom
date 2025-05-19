package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Player;
import com.sporteventstournaments.domain.dto.PlayerDTO;
import com.sporteventstournaments.exception.TeamNotFoundException;
import com.sporteventstournaments.exception.PlayerNotFoundException;
import com.sporteventstournaments.repository.TeamRepository;
import com.sporteventstournaments.repository.PlayerRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final Player player;
    private final TeamRepository teamRepository;

    public List<Player> getPlayers() {
        return playerRepository.findAll();
    }

    public Player getPlayer(Long id) {
        return playerRepository.findById(id).orElseThrow(PlayerNotFoundException::new);
    }
    public void createPlayer(PlayerDTO playerDTO) {
        long teamId = playerDTO.getTeamId();
        teamRepository.findById(teamId).orElseThrow(TeamNotFoundException::new);
        int size = playerRepository.findAll().size();
        player.setId((long) (size+1));
        player.setPlayerName(playerDTO.getPlayerName());
        player.setPlayerNumber(playerDTO.getPlayerNumber());
        player.setTitles(playerDTO.getTitles());
        player.setTeamId(teamId);
        playerRepository.save(player);
    }

    public void updatePlayer(Player player) {
        playerRepository.saveAndFlush(player);
    }

    @Transactional
    public void deletePlayerById(Long id){
        playerRepository.deleteById(id);
    }

}