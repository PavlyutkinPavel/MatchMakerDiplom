package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.TableEvent;
import lombok.Data;

@Data
public class TableEventDTO {
    private Long eventId;
    private EventDTO event;
    private Integer maxTeams;
    private TableEvent.TableEventStatus status;
}