package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM events e WHERE e.eventName = :name")
    Optional<Event> findByEventName(@Param("name") String name);

    @Query("SELECT e FROM events e WHERE e.createdBy = :userId")
    List<Event> findByCreatedBy(@Param("userId") Long userId);

    @Query("SELECT e FROM events e WHERE e.eventType = :eventType")
    List<Event> findByEventType(@Param("eventType") Event.EventType eventType);

    @Query(value = "SELECT NEXTVAL('events_id_seq')", nativeQuery = true)
    Long getNextSequenceValue();
}