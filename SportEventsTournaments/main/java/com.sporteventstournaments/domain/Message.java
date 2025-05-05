package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Entity(name = "messages")
@Component
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Message {
    @Id
    @SequenceGenerator(name = "messageSeqGen", sequenceName = "messages_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "messageSeqGen")
    private Long id;

    @Column(name = "message_content")
    private String content;

    @Column(name = "sender")
    private String sender;

    @Column(name = "message_type")
    @Enumerated(EnumType.STRING)
    private MessageType type;

    @JoinColumn(name = "chat_id")
    private Long chatId;

}
