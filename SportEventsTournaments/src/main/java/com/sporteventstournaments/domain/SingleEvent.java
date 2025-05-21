package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Single event information")
@Data
@Entity(name = "single_events")
public class SingleEvent {
    @Schema(description = "Event identifier")
    @Id
    @SequenceGenerator(name = "singleEventSeqGen", sequenceName = "single_events_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "singleEventSeqGen")
    private Long id;

    @OneToOne
    @JoinColumn(name = "id")
    @MapsId
    private Event event;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private SingleEventStatus status;

    public enum SingleEventStatus {
        PENDING, SCHEDULED, COMPLETED, CANCELLED
    }
}