package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Playoff event information")
@Data
@Entity(name = "playoff_events")
public class PlayoffEvent {
    @Schema(description = "Event identifier")
    @Id
    @SequenceGenerator(name = "playOffEventSeqGen", sequenceName = "playoff_events_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "playOffEventSeqGen")
    private Long id;

    @OneToOne
    @JoinColumn(name = "id")
    @MapsId
    private Event event;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private PlayoffEventStatus status;

    @Column(name = "bracket_size")
    private Integer bracketSize;

    public enum PlayoffEventStatus {
        DRAFT, ACTIVE, COMPLETED
    }
}