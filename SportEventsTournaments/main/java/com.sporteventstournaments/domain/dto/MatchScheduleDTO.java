package com.sporteventstournaments.domain.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MatchScheduleDTO {

    private LocalDateTime match_date;

    private String match_location;

    private Long homeTeam;

    private Long awayTeam;

    private Long available_tickets;

}