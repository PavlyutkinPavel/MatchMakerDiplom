package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HighlightAuthorRepository extends JpaRepository<HighlightAuthor, Long> {
}