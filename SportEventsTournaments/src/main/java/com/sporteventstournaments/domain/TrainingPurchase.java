package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Schema(description = "Покупка программы тренировок")
@Data
@Entity(name = "training_purchases")
public class TrainingPurchase {
    @Schema(description = "Уникальный идентификатор покупки")
    @Id
    @SequenceGenerator(name = "trainingPurchaseSeqGen", sequenceName = "training_purchases_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "trainingPurchaseSeqGen")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_program_id")
    @NotNull
    private TrainingProgram trainingProgram;

    @Column(name = "purchase_date")
    @NotNull
    private LocalDateTime purchaseDate;

    @Column(name = "amount_paid")
    @NotNull
    private BigDecimal amountPaid;

    @Column(name = "currency")
    private String currency = "RUB";

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "user_progress")
    private Integer userProgress = 0; // от 0 до 100

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        purchaseDate = LocalDateTime.now();
    }
}