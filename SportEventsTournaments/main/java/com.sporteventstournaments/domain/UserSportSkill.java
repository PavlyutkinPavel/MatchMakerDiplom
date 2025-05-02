package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Data
@Component
@Entity(name = "user_sportskills")
public class UserSportSkill {

    @Id
    @SequenceGenerator(name = "userSportSkillSeqGen", sequenceName = "user_sportskills_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "userSportSkillSeqGen")
    private Long id;

    @Column(name = "user_id")
    private Long user_id;

    @Column(name = "sport_name")
    private String sportName;

    @Column(name = "level")
    @NotNull
    private String level;

    @Column(name = "experience")
    @NotNull
    private String experience;
}
