package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.Event;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventDTO {
    private String eventName;
    private LocalDateTime eventDate;
    private String eventLocation;
    private Event.EventType eventType;
}