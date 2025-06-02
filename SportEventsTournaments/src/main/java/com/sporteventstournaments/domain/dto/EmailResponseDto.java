package com.sporteventstournaments.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
 public class EmailResponseDto {
    private String message;
    private String status;
    private Long emailId;
}
