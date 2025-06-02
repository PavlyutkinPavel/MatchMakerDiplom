package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamResponseDTO {
    private Long id;
    private String teamName;
    private String country;
    private String city;
    private String achievements;
    private String status;
    private String wins;
    private TeamType teamType;
    private Long creatorId;
    private Long directorId;
}
