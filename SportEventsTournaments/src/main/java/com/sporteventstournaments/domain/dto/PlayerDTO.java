package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class PlayerDTO {

    private String playerName;

    private Long playerNumber;

    private String titles;

    private Long teamId;
}