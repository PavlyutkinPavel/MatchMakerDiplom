package com.sporteventstournaments.domain.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SendEmailRequest {
    @NotBlank(message = "Email type is required")
    private String type;

    @NotEmpty(message = "Recipients are required")
    private List<String> recipients;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    // Дополнительные поля для team_invite
    private String teamName;
    private String teamSport;
    private Long teamId;

    // Дополнительные поля для event_invite
    private String eventName;
    private LocalDateTime eventDate;
    private String eventLocation;
    private Long eventId;
}
