package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Player;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sporteventstournaments.domain.Message;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(nativeQuery = true, value = "SELECT * FROM messages WHERE chat_id = :chatId")
    List<Message> findAllByChatId(@Param("chatId")Long chatId);

    @Modifying
    @Transactional
    @Query(nativeQuery = true, value = "DELETE FROM messages")
    void deleteAllMessages();
}
