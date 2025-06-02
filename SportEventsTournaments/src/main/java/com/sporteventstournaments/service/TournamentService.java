package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Tournament;
import com.sporteventstournaments.domain.dto.TournamentDto;
import com.sporteventstournaments.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TournamentService {

    private final TournamentRepository tournamentRepository;

    public List<TournamentDto> findAll() {
        return tournamentRepository.findAllByOrderByNameAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private TournamentDto convertToDto(Tournament tournament) {
        return TournamentDto.builder()
                .id(tournament.getId())
                .name(tournament.getName())
                .description(tournament.getDescription())
                .sportName(tournament.getSport() != null ? tournament.getSport().getName() : null)
                .build();
    }
}