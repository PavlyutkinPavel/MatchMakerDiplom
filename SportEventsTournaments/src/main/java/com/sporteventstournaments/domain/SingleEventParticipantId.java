package com.sporteventstournaments.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SingleEventParticipantId implements Serializable {
    private Long eventId;
    private Long userId;
}