package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.TrainingProgram;
import com.sporteventstournaments.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainingProgramRepository extends JpaRepository<TrainingProgram, Long> {

    List<TrainingProgram> findByIsActiveTrueOrderByCreatedAtDesc();

    List<TrainingProgram> findByCoachAndIsActiveTrueOrderByCreatedAtDesc(User coach);

    @Query("SELECT tp FROM training_programs tp WHERE tp.isActive = true AND " +
            "(LOWER(tp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(tp.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(tp.sportType) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<TrainingProgram> searchByKeyword(@Param("keyword") String keyword);
}
