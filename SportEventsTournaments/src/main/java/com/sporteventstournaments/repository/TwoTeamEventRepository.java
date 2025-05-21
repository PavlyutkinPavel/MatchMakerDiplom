package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TwoTeamEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwoTeamEventRepository extends JpaRepository<TwoTeamEvent, Long> {
    @Query("SELECT tte FROM two_team_events tte WHERE tte.status = :status")
    List<TwoTeamEvent> findByStatus(@Param("status") TwoTeamEvent.TwoTeamEventStatus status);

    @Query("SELECT tte FROM two_team_events tte WHERE tte.team1Id = :teamId OR tte.team2Id = :teamId")
    List<TwoTeamEvent> findByTeamId(@Param("teamId") Long teamId);
}