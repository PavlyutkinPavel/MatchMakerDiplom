package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query(value = "SELECT * FROM teams ORDER BY team_name", nativeQuery = true)
    List<Team> findAllOrderedByName();

    @Query(value = "SELECT * FROM teams WHERE team_name = :name", nativeQuery = true)
    Team findByName(@Param("name") String name);

    @Query(value = "SELECT * FROM teams WHERE location = :location", nativeQuery = true)
    List<Team> findByLocation(@Param("location") String location);

    @Query(value = "SELECT * FROM teams WHERE achievements IS NOT NULL", nativeQuery = true)
    List<Team> findClubsWithAchievements();

    @Query(value = "SELECT * FROM teams WHERE status = :status", nativeQuery = true)
    List<Team> findByStatus(@Param("status") String status);
}
