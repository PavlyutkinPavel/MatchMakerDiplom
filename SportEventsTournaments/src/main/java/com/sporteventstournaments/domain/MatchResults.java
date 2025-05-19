package com.sporteventstournaments.domain;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "match_results")
@Data
public class MatchResults {
    @Id
    @SequenceGenerator(name = "matchResultsSeqGen", sequenceName = "match_results_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "matchResultsSeqGen")
    private Long id;

    @Column(name = "final_score")
    private String finalScore;

    @Column(name = "description")
    private String description;

    @Column(name = "winner_id")
    private Long winnerId;
}