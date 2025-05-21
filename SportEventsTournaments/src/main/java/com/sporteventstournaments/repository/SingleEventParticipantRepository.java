package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.SingleEventParticipant;
import com.sporteventstournaments.domain.SingleEventParticipantId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SingleEventParticipantRepository extends JpaRepository<SingleEventParticipant, SingleEventParticipantId> {
    @Query("SELECT sep FROM single_event_participants sep WHERE sep.eventId = :eventId")
    List<SingleEventParticipant> findByEventId(@Param("eventId") Long eventId);

    @Query("SELECT sep FROM single_event_participants sep WHERE sep.userId = :userId")
    List<SingleEventParticipant> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(sep) FROM single_event_participants sep WHERE sep.eventId = :eventId")
    Integer countParticipantsByEventId(@Param("eventId") Long eventId);
}