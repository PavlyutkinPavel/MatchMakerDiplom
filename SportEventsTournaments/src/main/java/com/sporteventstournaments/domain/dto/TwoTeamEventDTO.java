package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.TwoTeamEvent;
import lombok.Data;

@Data
public class TwoTeamEventDTO {
    private Long eventId;
    private EventDTO event;
    private Long team1Id;
    private Long team2Id;
    private TwoTeamEvent.TwoTeamEventStatus status;
    private Integer team1Score;
    private Integer team2Score;
}
