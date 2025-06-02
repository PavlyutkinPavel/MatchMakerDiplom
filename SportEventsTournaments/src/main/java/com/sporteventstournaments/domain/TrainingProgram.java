package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@Schema(description = "Программа тренировок")
@Data
@Entity(name = "training_programs")
public class TrainingProgram {
    @Schema(description = "Уникальный идентификатор программы тренировок")
    @Id
    @SequenceGenerator(name = "trainingProgramSeqGen", sequenceName = "training_programs_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "trainingProgramSeqGen")
    private Long id;

    @Column(name = "title")
    @NotNull
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "price")
    @NotNull
    private BigDecimal price;

    @Column(name = "currency")
    private String currency = "RUB";

    @Column(name = "duration_weeks")
    private Integer durationWeeks;

    @Column(name = "sessions_per_week")
    private Integer sessionsPerWeek;

    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Column(name = "sport_type")
    private String sportType;

    @Column(name = "content", length = 5000)
    private String content;

    @Column(name = "rating")
    private Double rating = 0.0;

    @Column(name = "students_count")
    private Integer studentsCount = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_id")
    private User coach;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}