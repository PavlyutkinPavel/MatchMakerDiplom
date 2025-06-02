package com.sporteventstournaments.domain.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TournamentDto {
    private Long id;
    private String name;
    private String description;
    private String sportName;
}