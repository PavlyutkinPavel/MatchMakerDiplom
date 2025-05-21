package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.PlayoffEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayoffEventRepository extends JpaRepository<PlayoffEvent, Long> {
    @Query("SELECT pe FROM playoff_events pe WHERE pe.status = :status")
    List<PlayoffEvent> findByStatus(@Param("status") PlayoffEvent.PlayoffEventStatus status);
}