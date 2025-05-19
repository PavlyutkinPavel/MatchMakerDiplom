package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class TeamDTO {

    private String teamName;
    private String teamType;
    private String country;
    private String city;
    private String achievements;
    private String status;
    private String wins;

}