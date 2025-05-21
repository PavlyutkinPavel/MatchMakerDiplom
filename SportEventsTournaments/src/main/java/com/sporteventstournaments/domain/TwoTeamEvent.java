package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Two teams event information")
@Data
@Entity(name = "two_team_events")
public class TwoTeamEvent {
    @Schema(description = "Event identifier")
    @Id
    @Column(name = "event_id")
    private Long eventId;

    @OneToOne
    @JoinColumn(name = "event_id")
    @MapsId
    private Event event;

    @Column(name = "team1_id")
    private Long team1Id;

    @Column(name = "team2_id")
    private Long team2Id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TwoTeamEventStatus status;

    @Column(name = "team1_score")
    private Integer team1Score;

    @Column(name = "team2_score")
    private Integer team2Score;

    public enum TwoTeamEventStatus {
        PENDING, SCHEDULED, COMPLETED, CANCELLED
    }
}