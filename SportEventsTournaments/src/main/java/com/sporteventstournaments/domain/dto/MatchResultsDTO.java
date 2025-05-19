package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class MatchResultsDTO {

    private String final_score;

    private String description;

    private Long winnerId;
}