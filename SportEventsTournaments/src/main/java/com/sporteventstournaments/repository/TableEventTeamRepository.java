package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TableEventTeam;
import com.sporteventstournaments.domain.TableEventTeamId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableEventTeamRepository extends JpaRepository<TableEventTeam, TableEventTeamId> {
    @Query("SELECT tet FROM table_event_teams tet WHERE tet.eventId = :eventId ORDER BY tet.points DESC")
    List<TableEventTeam> findByEventIdOrderByPointsDesc(@Param("eventId") Long eventId);

    @Query("SELECT tet FROM table_event_teams tet WHERE tet.teamId = :teamId")
    List<TableEventTeam> findByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(tet) FROM table_event_teams tet WHERE tet.eventId = :eventId")
    Integer countTeamsByEventId(@Param("eventId") Long eventId);
}