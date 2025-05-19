package com.sporteventstournaments.config;

import com.sporteventstournaments.domain.Message;
import com.sporteventstournaments.domain.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String chatId = (String) headerAccessor.getSessionAttributes().get("id");
        if (username != null) {
            log.info("user disconnected: {}", username);
            var chatMessage = Message.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .content("")
                    .build();
            messagingTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }

}