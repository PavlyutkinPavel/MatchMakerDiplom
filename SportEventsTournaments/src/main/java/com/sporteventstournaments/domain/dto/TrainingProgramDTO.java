package com.sporteventstournaments.domain.dto;


import com.sporteventstournaments.domain.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainingProgramDTO {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private Integer durationWeeks;
    private Integer sessionsPerWeek;
    private DifficultyLevel difficultyLevel;
    private String sportType;
    private String content;
    private Double rating;
    private Integer studentsCount;
    private LocalDateTime createdAt;
    private String coachName;
    private Long coachId;
    private Boolean isActive;
    private Boolean isPurchased;
    private Integer userProgress;
}