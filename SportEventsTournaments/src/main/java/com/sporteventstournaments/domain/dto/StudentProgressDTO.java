package com.sporteventstournaments.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentProgressDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long programId;
    private String programTitle;
    private Integer userProgress;
    private LocalDateTime purchaseDate;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String paymentMethod;

    // Конструктор для создания из TrainingPurchase
    public StudentProgressDTO(Long id, Long userId, String firstName, String lastName,
                              String email, Long programId, String programTitle,
                              Integer userProgress, LocalDateTime purchaseDate,
                              LocalDateTime startedAt, LocalDateTime completedAt,
                              String paymentMethod) {
        this.id = id;
        this.userId = userId;
        this.userName = firstName + " " + lastName;
        this.userEmail = email;
        this.programId = programId;
        this.programTitle = programTitle;
        this.userProgress = userProgress;
        this.purchaseDate = purchaseDate;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.paymentMethod = paymentMethod;
    }
}