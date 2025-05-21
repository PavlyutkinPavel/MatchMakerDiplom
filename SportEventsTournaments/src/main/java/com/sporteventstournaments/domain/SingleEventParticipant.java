package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Schema(description = "Single event participant information")
@Data
@Entity(name = "single_event_participants")
@IdClass(SingleEventParticipantId.class)
public class SingleEventParticipant {
    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Id
    @Column(name = "user_id")
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private SingleEvent singleEvent;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "invitation_sent")
    private Boolean invitationSent;

    @Column(name = "accepted")
    private Boolean accepted;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}