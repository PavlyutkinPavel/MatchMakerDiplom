package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Chat;
import com.sporteventstournaments.domain.Message;
import com.sporteventstournaments.domain.Room;
import com.sporteventstournaments.domain.User;
import com.sporteventstournaments.domain.dto.ChatDTO;
import com.sporteventstournaments.playload.MessageRequest;
import com.sporteventstournaments.repository.RoomRepository;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.ChatService;
import com.sporteventstournaments.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Tag(name = "Chat Controller", description = "Main controller, makes all operations with chats")
@Controller
@RequestMapping("/chat")
@CrossOrigin("http://localhost:3000")
public class ChatController {

    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")// /app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}")//subscribe
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request
    ) {

        Room room = roomRepository.findByRoomId(request.getRoomId());
        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());
        if (room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("room not found !!");
        }

        return message;


    }

    /*private final ChatService chatService;
    private final SecurityService securityService;

    private final UserService userService;

    public ChatController(ChatService chatService, SecurityService securityService, UserService userService) {
        this.chatService = chatService;
        this.securityService = securityService;
        this.userService = userService;
    }

    @Operation(summary = "get all chats in app")
    @GetMapping
    public ResponseEntity<List<Chat>> getChats(Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            List<Chat> chats = chatService.getChats();
            if (chats.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(chats, HttpStatus.OK);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "user can get all his chats in app")
    @GetMapping("/chat_list_creator/{username}")
    public ResponseEntity<List<Chat>> getChatList(Principal principal, @PathVariable String username) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (username == principal.getName() || securityService.checkIfAdmin(principal.getName())) {
            List<Chat> chats = chatService.getChatList(principal);
            if (chats.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                return new ResponseEntity<>(chats, HttpStatus.OK);
            }
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    //no security because chat don't have active user
    @Operation(summary = "user can get any chat he has in app")
    @GetMapping("/{id}")
    public ResponseEntity<Chat> getChat(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Chat chat = chatService.getChat(id, principal);
        if (chat != null) {
            return new ResponseEntity<>(chat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Operation(summary = "users can create their own chats")
    @PostMapping
    public ResponseEntity<HttpStatus> createChat(@RequestBody ChatDTO chatDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        chatService.createChat(chatDTO, principal);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @PostMapping("/enter/{chatId}")
    public  ResponseEntity<HttpStatus> enterChat(@PathVariable Long chatId, @RequestParam String chatName, Principal principal){
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        Chat chat = chatService.getChatGlobalSearch(chatId, principal);
        if(Objects.equals(chat.getChatName(), chatName)){
            Long userId = securityService.getUserIdByLogin(principal.getName());
            User user = userService.getUser(userId, principal);
            chatService.enterChat(chat, user);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }else{
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }



    @Operation(summary = "admins can update their own chats")
    @PutMapping
    public ResponseEntity<HttpStatus> updateChat(@RequestBody Chat chat, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            chatService.updateChat(chat);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "users can update name of their own chats")
    @PutMapping("/update_name/{id}")
    public ResponseEntity<HttpStatus> updateChatName(@PathVariable Long id, @RequestParam String newChatName, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            chatService.updateChatName(id, newChatName);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "users can update description of their own chats")
    @PutMapping("/update_description/{id}")
    public ResponseEntity<HttpStatus> updateChatDescription(@PathVariable Long id, @RequestParam String newChatDescription, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            chatService.updateChatDescription(id, newChatDescription);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "admins can delete their own chats")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteChat(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            chatService.deleteChatById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "admins can delete users from their own chats")
    @DeleteMapping("/{chatId}/delete_user/{userId}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long chatId, @PathVariable Long userId, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName())) {
            chatService.deleteUser(userId, chatId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }

    @Operation(summary = "users can leave chat")
    @DeleteMapping("/{chatId}/leave_chat/{username}")
    public ResponseEntity<HttpStatus> leaveChat(@PathVariable Long chatId, @PathVariable String username, Principal principal) {
        if (principal == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        deleteUser(chatId, securityService.getUserIdByLogin(username), principal);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }*/
}