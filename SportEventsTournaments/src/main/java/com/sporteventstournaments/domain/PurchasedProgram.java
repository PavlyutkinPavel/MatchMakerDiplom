package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Schema(description = "Купленная программа тренировок")
@Data
@Entity(name = "purchased_programs")
public class PurchasedProgram {
    @Schema(description = "Уникальный идентификатор покупки")
    @Id
    @SequenceGenerator(name = "purchasedProgramSeqGen", sequenceName = "purchased_programs_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "purchasedProgramSeqGen")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id")
    private TrainingProgram trainingProgram;

    @Column(name = "purchased_at")
    private LocalDateTime purchasedAt;

    @Column(name = "paid_amount")
    private BigDecimal paidAmount;

    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        purchasedAt = LocalDateTime.now();
    }
}