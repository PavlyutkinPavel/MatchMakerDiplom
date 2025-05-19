package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.*;
import com.sporteventstournaments.domain.dto.ChatDTO;
import com.sporteventstournaments.repository.ChatRepository;
import com.sporteventstournaments.repository.UserChatRelationRepository;
import com.sporteventstournaments.security.domain.SecurityCredentials;
import com.sporteventstournaments.security.repository.SecurityCredentialsRepository;
import com.sporteventstournaments.exception.ChatNotFoundException;
import com.sporteventstournaments.exception.UserNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class ChatService {
    private final ChatRepository chatRepository;
    private final UserChatRelationRepository userChatRelationRepository;
    private final SecurityCredentialsRepository securityCredentialsRepository;
    private final Chat chat;
    private final UserChatRelation userChatRelation;

    public List<Chat> getChats() {
        return chatRepository.findAll();
    }

    public List<Chat> getChatList(Principal principal) {
        Long userId = securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new).getUserId();
        return chatRepository.findAllByCreator(userId);
    }

    //add security after adding private chats
    public Chat getChatGlobalSearch(Long id, Principal principal){
        return chatRepository.findByIdChat(id).orElseThrow(ChatNotFoundException::new);
    }
    public Chat getChat(Long id, Principal principal) {
        SecurityCredentials credentials = securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Long currentUserId = credentials.getUserId();
        Chat chat =  chatRepository.findByIdChat(id).orElseThrow(ChatNotFoundException::new);
        Role role = credentials.getUserRole();
        Boolean ifChatMember = false;
        List<Chat> chatList = getChatList(principal);
        for (Chat myChat: chatList){
            if(myChat.getId() == chat.getId()){
                ifChatMember = true;
            }
        }
        if( ifChatMember || (role.toString() == "ADMIN")){
            return chat;
        }else{
            return null;
        }
    }
    public void createChat(ChatDTO chatDTO, Principal principal) {
        chat.setCreator(securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new).getUserId());
        int size = chatRepository.findAll().size();
        chat.setId((long) (size+1));
        chat.setChatName(chatDTO.getChatName());
        chat.setDescription(chatDTO.getDescription());
        chatRepository.save(chat);
    }

    public void updateChat(Chat chat) {
        chatRepository.saveAndFlush(chat);
    }

    public void enterChat(Chat chat, User user){
        Long id = userChatRelationRepository.getNextId();
        Long chatId = chat.getId();
        Long userId = user.getId();
        userChatRelationRepository.saveEntrance(id, chatId, userId);
    }

    public void deleteChatById(Long id){
        chatRepository.deleteById(id);
    }


    public void deleteUser(Long userId, Long chatId) {
        userChatRelationRepository.removeUserByIdAndChatId(userId, chatId);
    }

    public void updateChatName(Long chatId, String newChatName) {
        Chat chat = chatRepository.findByIdChat(chatId).orElseThrow(UserNotFoundException::new);
        chat.setChatName(newChatName);
        chatRepository.saveAndFlush(chat);
    }

    public void updateChatDescription(Long chatId, String newChatDescription) {
        Chat chat = chatRepository.findByIdChat(chatId).orElseThrow(UserNotFoundException::new);
        chat.setDescription(newChatDescription);
        chatRepository.saveAndFlush(chat);
    }
}