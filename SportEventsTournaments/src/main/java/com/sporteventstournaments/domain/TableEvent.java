package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Table event information")
@Data
@Entity(name = "table_events")
public class TableEvent {
    @Schema(description = "Event identifier")
    @Id
    @Column(name = "event_id")
    private Long eventId;

    @OneToOne
    @JoinColumn(name = "event_id")
    @MapsId
    private Event event;

    @Column(name = "max_teams")
    private Integer maxTeams;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private TableEventStatus status;

    public enum TableEventStatus {
        OPEN, IN_PROGRESS, COMPLETED
    }
}