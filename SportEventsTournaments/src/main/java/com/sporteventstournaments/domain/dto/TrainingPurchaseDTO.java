package com.sporteventstournaments.domain.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TrainingPurchaseDTO {
    private Long id;
    private Long userId;
    private String userLogin;
    private Long trainingProgramId;
    private String trainingProgramTitle;
    private LocalDateTime purchaseDate;
    private BigDecimal amountPaid;
    private String currency;
    private String paymentMethod;
    private Integer userProgress;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private Boolean isActive;
}

