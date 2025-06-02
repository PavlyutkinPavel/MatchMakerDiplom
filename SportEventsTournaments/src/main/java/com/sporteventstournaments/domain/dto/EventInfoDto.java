package com.sporteventstournaments.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
 public class EventInfoDto {
    private Long id;
    private String name;
    private LocalDateTime date;
    private String location;
}
