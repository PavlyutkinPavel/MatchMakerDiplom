package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class StadiumDTO {

    private String stadiumName;

    private String stadiumLocation;

    private Long capacity;

    private Long teamId;

}