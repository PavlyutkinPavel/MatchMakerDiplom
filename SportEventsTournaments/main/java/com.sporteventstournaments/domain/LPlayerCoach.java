package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "l_player_coach")
@Data
public class LPlayerCoach {
    @Id
    @SequenceGenerator(name = "l_player_coachSeqGen", sequenceName = "l_player_coach_seq", allocationSize = 1)
    @GeneratedValue(generator = "l_player_coachSeqGen")
    private Long id;

    @Column(name = "player_id")
    private Long playerId;

    @Column(name = "coach_id")
    private Long coachId;

    @Column(name = "specialization")
    private String specialization;
}