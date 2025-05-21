package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Schema(description = "Playoff match information")
@Data
@Entity(name = "playoff_matches")
@IdClass(PlayoffMatchId.class)
public class PlayoffMatch {
    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Id
    @Column(name = "match_number")
    private Integer matchNumber;

    @ManyToOne
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private PlayoffEvent playoffEvent;

    @Column(name = "round")
    private Integer round;

    @Column(name = "team1_id")
    private Long team1Id;

    @Column(name = "team2_id")
    private Long team2Id;

    @Column(name = "team1_score")
    private Integer team1Score;

    @Column(name = "team2_score")
    private Integer team2Score;

    @Column(name = "winner_team_id")
    private Long winnerTeamId;

    @Column(name = "match_start_time")
    private LocalDateTime matchStartTime;
}