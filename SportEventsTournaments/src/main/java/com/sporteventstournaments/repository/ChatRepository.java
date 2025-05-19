package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Chat;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {

    @Query(value = "SELECT * FROM chats WHERE chat_creator = : creatorId", nativeQuery = true)
    List<Chat> findAllByCreator(@Param("creatorId") Long creatorId);

    @Query(value = "SELECT * FROM chats WHERE id = :id", nativeQuery = true)
    Optional<Chat> findByIdChat(@Param("id") Long id);
}
