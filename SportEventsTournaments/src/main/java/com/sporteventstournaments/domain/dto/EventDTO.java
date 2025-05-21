package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.Event;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {
    private Long id;
    private String eventName;
    private LocalDateTime eventDate;
    private String eventLocation;
    private Event.EventType eventType;
    private Long createdBy;
    private LocalDateTime createdAt;
}