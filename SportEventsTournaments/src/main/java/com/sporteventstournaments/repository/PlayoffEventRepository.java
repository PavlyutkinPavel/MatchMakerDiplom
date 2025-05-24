package com.sporteventstournaments.repository;


import com.sporteventstournaments.domain.PlayoffEvent;
import com.sporteventstournaments.domain.PlayoffEvent.PlayoffEventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayoffEventRepository extends JpaRepository<PlayoffEvent, Long> {

    List<PlayoffEvent> findByStatus(PlayoffEventStatus status);

    List<PlayoffEvent> findByBracketSize(Integer bracketSize);

    @Query("SELECT pe FROM playoff_events pe WHERE pe.status = :status AND pe.bracketSize = :bracketSize")
    List<PlayoffEvent> findByStatusAndBracketSize(@Param("status") PlayoffEventStatus status,
                                                  @Param("bracketSize") Integer bracketSize);

    boolean existsByEventId(Long eventId);
}