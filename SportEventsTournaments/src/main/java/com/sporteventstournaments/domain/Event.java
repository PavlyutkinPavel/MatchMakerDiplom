package com.sporteventstournaments.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Schema(description = "Event information")
@Data
@Entity(name = "events")
public class Event {
    @Schema(description = "Unique event identifier")
    @Id
    @SequenceGenerator(name = "eventSeqGen", sequenceName = "events_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "eventSeqGen")
    private Long id;

    @Column(name = "event_name")
    @NotNull
    private String eventName;

    @Column(name = "event_date")
    private LocalDateTime eventDate;

    @Column(name = "event_location")
    private String eventLocation;

    @Column(name = "event_type")
    @Enumerated(EnumType.STRING)
    @NotNull
    private EventType eventType;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "sport_type")
    @Enumerated(EnumType.STRING)
    @NotNull
    private SportType sportType;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonManagedReference("email-event")
    private List<Email> eventInvites;


    public enum EventType {
        SINGLE, TWO_TEAMS, TABLE, PLAYOFF
    }
    public enum SportType {
        FOOTBALL, VOLLEYBALL, BASKETBALL, HOCKEY, TENNIS    }
}