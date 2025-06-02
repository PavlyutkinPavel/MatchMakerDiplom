package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Highlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, Long>, JpaSpecificationExecutor<Highlight> {

    @Query("SELECT h FROM highlights h " +
            "LEFT JOIN FETCH h.sport s " +
            "LEFT JOIN FETCH h.category c " +
            "LEFT JOIN FETCH h.tournament t " +
            "LEFT JOIN FETCH h.authors ha " +
            "LEFT JOIN FETCH ha.user a " +
            "WHERE (:sport IS NULL OR s.id = :sport) " +
            "AND (:category IS NULL OR c.id = :category) " +
            "AND (:type IS NULL OR h.type = :type) " +
            "AND (:search IS NULL OR " +
            "      LOWER(h.title) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "   OR LOWER(h.description) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))) " +
            "ORDER BY h.createdAt DESC")
    List<Highlight> findFilteredHighlights(
            @Param("sport") Long sport,
            @Param("category") Long category,
            @Param("type") Highlight.HighlightType type,
            @Param("search") String search
    );
}
