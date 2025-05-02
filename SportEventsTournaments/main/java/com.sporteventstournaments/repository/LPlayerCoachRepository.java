package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.LPlayerCoach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LPlayerCoachRepository extends JpaRepository<LPlayerCoach, Long> {
}
