package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TableEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableEventRepository extends JpaRepository<TableEvent, Long> {
    @Query("SELECT te FROM table_events te WHERE te.status = :status")
    List<TableEvent> findByStatus(@Param("status") TableEvent.TableEventStatus status);
}