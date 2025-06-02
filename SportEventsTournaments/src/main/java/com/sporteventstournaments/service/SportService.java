package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.dto.*;
import com.sporteventstournaments.domain.*;
import com.sporteventstournaments.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SportService {

    private final SportRepository sportRepository;

    public List<SportDto> findAll() {
        return sportRepository.findAllByOrderByNameAsc().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private SportDto convertToDto(Sport sport) {
        return SportDto.builder()
                .id(sport.getId())
                .name(sport.getName())
                .description(sport.getDescription())
                .build();
    }
}



