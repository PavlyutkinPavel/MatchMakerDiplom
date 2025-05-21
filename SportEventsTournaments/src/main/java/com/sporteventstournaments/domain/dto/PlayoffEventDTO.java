package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.PlayoffEvent;
import lombok.Data;

@Data
public class PlayoffEventDTO {
    private Long eventId;
    private EventDTO event;
    private PlayoffEvent.PlayoffEventStatus status;
    private Integer bracketSize;
}