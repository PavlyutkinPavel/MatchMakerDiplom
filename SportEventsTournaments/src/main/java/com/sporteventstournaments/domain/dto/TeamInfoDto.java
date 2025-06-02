package com.sporteventstournaments.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
 public class TeamInfoDto {
    private Long id;
    private String name;
    private String sport;
}
