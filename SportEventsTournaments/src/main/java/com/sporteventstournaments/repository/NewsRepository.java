package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.News;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM news WHERE team_id = :teamId")
    Optional<News> findByClubNews(@Param("teamId") Long teamId);
}
