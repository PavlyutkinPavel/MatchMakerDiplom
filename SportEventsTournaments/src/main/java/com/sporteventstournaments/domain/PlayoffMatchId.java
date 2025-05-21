package com.sporteventstournaments.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlayoffMatchId implements Serializable {
    private Long eventId;
    private Integer matchNumber;
}