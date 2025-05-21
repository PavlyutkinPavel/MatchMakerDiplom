package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.SingleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SingleEventRepository extends JpaRepository<SingleEvent, Long> {
    @Query("SELECT se FROM single_events se WHERE se.status = :status")
    List<SingleEvent> findByStatus(@Param("status") SingleEvent.SingleEventStatus status);
}