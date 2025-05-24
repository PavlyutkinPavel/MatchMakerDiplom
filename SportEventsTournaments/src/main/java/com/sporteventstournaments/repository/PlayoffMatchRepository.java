package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.PlayoffMatch;
import com.sporteventstournaments.domain.PlayoffMatchId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PlayoffMatchRepository extends JpaRepository<PlayoffMatch, PlayoffMatchId> {

    List<PlayoffMatch> findByEventId(Long eventId);

    List<PlayoffMatch> findByEventIdAndRound(Long eventId, Integer round);

    List<PlayoffMatch> findByEventIdOrderByRoundAscMatchNumberAsc(Long eventId);

    @Query("SELECT pm FROM playoff_matches pm WHERE pm.eventId = :eventId AND pm.winnerTeamId IS NULL")
    List<PlayoffMatch> findUnfinishedMatchesByEventId(@Param("eventId") Long eventId);

    @Query("SELECT pm FROM playoff_matches pm WHERE pm.eventId = :eventId AND pm.round = :round AND pm.winnerTeamId IS NULL")
    List<PlayoffMatch> findUnfinishedMatchesByEventIdAndRound(@Param("eventId") Long eventId, @Param("round") Integer round);

    @Query("SELECT DISTINCT pm.round FROM playoff_matches pm WHERE pm.eventId = :eventId ORDER BY pm.round")
    List<Integer> findRoundsByEventId(@Param("eventId") Long eventId);

    List<PlayoffMatch> findByMatchStartTimeBetween(LocalDateTime start, LocalDateTime end);

    // Method to delete all matches for a specific event
    void deleteByEventId(Long eventId);

    @Query("DELETE FROM playoff_matches pm WHERE pm.eventId = :eventId")
    void deleteAllByEventId(@Param("eventId") Long eventId);
}
