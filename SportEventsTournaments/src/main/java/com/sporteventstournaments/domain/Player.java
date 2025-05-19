package com.sporteventstournaments.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Schema(description = "Описание пользователя")
@Data
@Entity(name = "players")
public class Player {
    @Schema(description = "Это уникальный идентификатор пользователя")
    @Id
    @SequenceGenerator(name = "playerSeqGen", sequenceName = "players_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "playerSeqGen")
    private Long id;

    @Column(name = "player_name")
    private String playerName;

    @Column(name = "player_number")
    private Long playerNumber;

    @Column(name = "titles")
    private String titles;

    @Column(name = "team_id")
    private Long teamId;

}
