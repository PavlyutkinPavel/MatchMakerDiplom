package com.sporteventstournaments.domain.dto;

import lombok.Data;

@Data
public class NewsDTO {

    private String title;

    private String newsText;

    private Long teamId;
}