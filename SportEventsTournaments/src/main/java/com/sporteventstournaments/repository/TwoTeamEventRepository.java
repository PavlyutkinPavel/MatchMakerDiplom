package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TwoTeamEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TwoTeamEventRepository extends JpaRepository<TwoTeamEvent, Long> {

    // Существующие методы
    List<TwoTeamEvent> findByStatus(TwoTeamEvent.TwoTeamEventStatus status);

    @Query("SELECT tte FROM two_team_events tte WHERE tte.team1Id = :teamId OR tte.team2Id = :teamId")
    List<TwoTeamEvent> findByTeamId(@Param("teamId") Long teamId);

    // Новые методы для улучшенной функциональности
    List<TwoTeamEvent> findByStatusIn(List<TwoTeamEvent.TwoTeamEventStatus> statuses);

    List<TwoTeamEvent> findByEventIdIn(List<Long> eventIds);

    @Query("SELECT tte FROM two_team_events tte WHERE tte.team1Id = :teamId AND tte.status IN :statuses")
    List<TwoTeamEvent> findByTeam1IdAndStatusIn(@Param("teamId") Long teamId,
                                                @Param("statuses") List<TwoTeamEvent.TwoTeamEventStatus> statuses);

    @Query("SELECT tte FROM two_team_events tte WHERE tte.team2Id = :teamId AND tte.status IN :statuses")
    List<TwoTeamEvent> findByTeam2IdAndStatusIn(@Param("teamId") Long teamId,
                                                @Param("statuses") List<TwoTeamEvent.TwoTeamEventStatus> statuses);

    @Query("SELECT tte FROM two_team_events tte WHERE (tte.team1Id = :teamId OR tte.team2Id = :teamId) AND tte.status IN :statuses")
    List<TwoTeamEvent> findByTeamIdAndStatusIn(@Param("teamId") Long teamId,
                                               @Param("statuses") List<TwoTeamEvent.TwoTeamEventStatus> statuses);

    @Query("SELECT COUNT(tte) > 0 FROM two_team_events tte WHERE tte.id = :eventId")
    boolean existsByEventId(@Param("eventId") Long eventId);

    // Дополнительные полезные запросы
    @Query("SELECT tte FROM two_team_events tte JOIN tte.event e WHERE e.createdBy = :userId")
    List<TwoTeamEvent> findByEventCreator(@Param("userId") Long userId);

    @Query("SELECT tte FROM two_team_events tte WHERE tte.status = 'COMPLETED' AND (tte.team1Score > tte.team2Score AND tte.team1Id = :teamId) OR (tte.team2Score > tte.team1Score AND tte.team2Id = :teamId)")
    List<TwoTeamEvent> findWonEventsByTeamId(@Param("teamId") Long teamId);
}