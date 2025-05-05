package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Message;
import com.sporteventstournaments.domain.dto.MessageDTO;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.exception.MessageNotFoundException;
import com.sporteventstournaments.domain.Role;
import com.sporteventstournaments.repository.ChatRepository;
import com.sporteventstournaments.repository.MessageRepository;
import com.sporteventstournaments.security.domain.SecurityCredentials;
import com.sporteventstournaments.security.repository.SecurityCredentialsRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@AllArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final SecurityCredentialsRepository securityCredentialsRepository;
    private final ChatRepository chatRepository;
    private final ChatService chatService;
    private final Message message;

    public List<Message> getMessages() {
        return messageRepository.findAll();
    }

    public Message getMessage(Long id, Principal principal) {
        SecurityCredentials credentials = securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Message message =  messageRepository.findById(id).orElseThrow(MessageNotFoundException::new);
        Role role = credentials.getUserRole();
        if((principal.getName() == message.getSender()) || (role.toString() == "ADMIN")){
            return message;
        }else{
            return null;
        }
    }

//    public List<Message> getChatMessages(Long chatId, Principal principal) {
//        SecurityCredentials credentials = securityCredentialsRepository.findUserIdByLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
//        Long currentUserId = credentials.getUserId();
//        Chat chatResult =  chatRepository.findByIdChat(chatId).orElseThrow(ChatNotFoundException::new);
//        Role role = credentials.getUserRole();
//        Boolean ifChatMember = false;
//        List<Chat> chatList = chatService.getChatList(currentUserId);
//        for (Chat myChat: chatList){
//            if(myChat.getId() == chatResult.getId()){
//                ifChatMember = true;
//            }
//        }
//        if( ifChatMember || (role.toString() == "ADMIN")){
//            if (chatResult != null) {
//                return messageRepository.findAllByChatId(chatId);
//            }
//        }else{
//            return null;
//        }
//        return null;
//    }
    public void createMessage(MessageDTO messageDTO, Principal principal) {
        int size = messageRepository.findAll().size();
        message.setId((long) (size+1));
        message.setType(messageDTO.getType());
        message.setContent(messageDTO.getContent());
        message.setSender(principal.getName());
        message.setChatId(messageDTO.getChatId());
        messageRepository.save(message);
    }

    public void updateMessage(Message message) {
        messageRepository.saveAndFlush(message);
    }

    public void deleteMessageById(Long id){
        messageRepository.deleteById(id);
    }

    public void deleteAllMessages(){
        messageRepository.deleteAllMessages();
    }
}
