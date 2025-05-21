package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.PlayoffMatch;
import com.sporteventstournaments.domain.PlayoffMatchId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayoffMatchRepository extends JpaRepository<PlayoffMatch, PlayoffMatchId> {
    @Query("SELECT pm FROM playoff_matches pm WHERE pm.eventId = :eventId ORDER BY pm.round, pm.matchNumber")
    List<PlayoffMatch> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT pm FROM playoff_matches pm WHERE pm.eventId = :eventId AND pm.round = :round ORDER BY pm.matchNumber")
    List<PlayoffMatch> findByEventIdAndRound(@Param("eventId") Long eventId, @Param("round") Integer round);

    @Query("SELECT pm FROM playoff_matches pm WHERE pm.team1Id = :teamId OR pm.team2Id = :teamId")
    List<PlayoffMatch> findByTeamId(@Param("teamId") Long teamId);
}