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
public class EmailDto {
    private Long id;
    private String type; // team_invite, event_invite, info
    private String sender;
    private String senderAvatar;
    private String recipient;
    private String subject;
    private String message;
    private LocalDateTime date;
    private Boolean unread;
    private String status; // pending, accepted, declined, sent
    private TeamInfoDto teamInfo;
    private EventInfoDto eventInfo;
}

