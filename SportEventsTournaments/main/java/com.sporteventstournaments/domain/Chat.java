package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

@Component
@Entity(name = "chats")
@Data
public class Chat {
    @Id
    @SequenceGenerator(name = "chatSeqGen", sequenceName = "chats_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "chatSeqGen")
    private Long id;

    @Column(name = "chat_name")
    private String chatName;

    @Column(name = "chat_description")
    private String description;

    @Column(name = "chat_creator")
    private Long creator;
}