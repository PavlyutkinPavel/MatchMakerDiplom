package com.sporteventstournaments.domain.dto;

import com.sporteventstournaments.domain.MessageType;
import lombok.Data;

@Data
public class MessageDTO {

    private String content;

    private MessageType type;

    private Long chatId;

}