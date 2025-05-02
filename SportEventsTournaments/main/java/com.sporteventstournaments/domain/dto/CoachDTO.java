package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class CoachDTO {

    private String coachName;

    private String biography;

    private String achievements;

    private Long teamId;

}