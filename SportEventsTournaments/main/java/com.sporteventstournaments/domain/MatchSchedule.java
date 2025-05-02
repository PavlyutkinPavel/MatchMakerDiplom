package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Entity(name = "match_schedule")
@Data
public class MatchSchedule {
    @Id
    @SequenceGenerator(name = "matchScheduleSeqGen", sequenceName = "match_schedule_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "matchScheduleSeqGen")
    private Long id;

    @Column(name = "match_date")
    private LocalDateTime matchDate;

    @Column(name = "match_location")
    private String matchLocation;

    @Column(name = "home_team_id")
    private Long homeTeam;

    @Column(name = "away_team_id")
    private Long awayTeam;

    @Column(name = "available_tickets")
    private Long availableTickets;


}