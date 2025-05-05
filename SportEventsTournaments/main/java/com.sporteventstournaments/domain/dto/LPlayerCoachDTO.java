package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class LPlayerCoachDTO {

    private Long playerId;

    private Long coachId;

    private String specialization;
}