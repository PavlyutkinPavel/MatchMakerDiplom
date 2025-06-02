package com.sporteventstournaments.repository;

import com.sporteventstournaments.domain.Email;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.EmailStatus;
import com.sporteventstournaments.domain.EmailType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailRepository extends JpaRepository<Email, Long> {

    // Получить входящие письма пользователя
    @Query("SELECT e FROM emails e WHERE e.recipientUser = :user AND e.deletedByRecipient = false " +
            "AND (:type IS NULL OR e.type = :type) " +
            "AND (:unread IS NULL OR e.unread = :unread) " +
            "ORDER BY e.date DESC")
    Page<Email> findReceivedEmails(@Param("user") User user,
                                   @Param("type") EmailType type,
                                   @Param("unread") Boolean unread,
                                   Pageable pageable);

    // Получить отправленные письма пользователя
    @Query("SELECT e FROM emails e WHERE e.senderUser = :user AND e.deletedBySender = false " +
            "AND (:type IS NULL OR e.type = :type) " +
            "AND (:status IS NULL OR e.status = :status) " +
            "ORDER BY e.date DESC")
    Page<Email> findSentEmails(@Param("user") User user,
                               @Param("type") EmailType type,
                               @Param("status") EmailStatus status,
                               Pageable pageable);

    // Количество непрочитанных писем
    @Query("SELECT COUNT(e) FROM emails e WHERE e.recipientUser = :user AND e.unread = true AND e.deletedByRecipient = false")
    Integer countUnreadEmails(@Param("user") User user);

    // Найти письмо по ID для конкретного пользователя (либо отправитель, либо получатель)
    @Query("SELECT e FROM emails e WHERE e.id = :emailId AND " +
            "(e.senderUser = :user OR e.recipientUser = :user)")
    Email findByIdAndUser(@Param("emailId") Long emailId, @Param("user") User user);
}