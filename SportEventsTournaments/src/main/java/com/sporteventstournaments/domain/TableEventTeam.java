package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Table event team information")
@Data
@Entity(name = "table_event_teams")
@IdClass(TableEventTeamId.class)
public class TableEventTeam {
    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Id
    @Column(name = "team_id")
    private Long teamId;

    @ManyToOne
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private TableEvent tableEvent;

    @Column(name = "points")
    private Integer points;

    @Column(name = "wins")
    private Integer wins;

    @Column(name = "losses")
    private Integer losses;

    @Column(name = "draws")
    private Integer draws;
}