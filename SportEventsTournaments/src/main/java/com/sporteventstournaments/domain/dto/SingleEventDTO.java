package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.SingleEvent;
import lombok.Data;

@Data
public class SingleEventDTO {
    private Long eventId;
    private EventDTO event;
    private Integer maxParticipants;
    private SingleEvent.SingleEventStatus status;
}