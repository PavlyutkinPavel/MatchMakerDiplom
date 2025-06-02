package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.*;
import com.sporteventstournaments.domain.dto.*;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.*;
import com.sporteventstournaments.exception.ResourceNotFoundException;
import com.sporteventstournaments.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class EmailService {

    private final EmailRepository emailRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public Page<EmailDto> getReceivedEmails(Pageable pageable, String type, Boolean unread, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        EmailType emailType = type != null ? EmailType.fromValue(type) : null;

        Page<Email> emails = emailRepository.findReceivedEmails(currentUser, emailType, unread, pageable);
        return emails.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public Page<EmailDto> getSentEmails(Pageable pageable, String type, String status, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        EmailType emailType = type != null ? EmailType.fromValue(type) : null;
        EmailStatus emailStatus = status != null ? EmailStatus.fromValue(status) : null;

        Page<Email> emails = emailRepository.findSentEmails(currentUser, emailType, emailStatus, pageable);
        return emails.map(this::convertToDto);
    }

    @Transactional(readOnly = true)
    public EmailDto getEmailById(Long emailId, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Email email = emailRepository.findByIdAndUser(emailId, currentUser);

        if (email == null) {
            throw new ResourceNotFoundException("Email not found with id: " + emailId);
        }

        return convertToDto(email);
    }

    public EmailDto sendEmail(SendEmailRequest request, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);

        // Для простоты отправляем каждому получателю отдельное письмо
        List<String> recipients = request.getRecipients();
        if (recipients.isEmpty()) {
            throw new IllegalArgumentException("Recipients list cannot be empty");
        }

        // Отправляем первому получателю (можно модифицировать для массовой рассылки)
        String recipientUsername = recipients.get(0);
        User recipientUser = userRepository.findByUserLogin(recipientUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + recipientUsername));

        Email.EmailBuilder emailBuilder = Email.builder()
                .type(EmailType.fromValue(request.getType()))
                .sender(currentUser.getUserLogin())
                //.senderAvatar(currentUser.getAvatar())
                .recipient(recipientUser.getUserLogin())
                .subject(request.getSubject())
                .message(request.getMessage())
                .senderUser(currentUser)
                .recipientUser(recipientUser)
                .status(EmailStatus.SENT);

        // Добавляем связанные сущности в зависимости от типа
        if (request.getType().equals("team_invite") && request.getTeamId() != null) {
            Team team = teamRepository.findById(request.getTeamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + request.getTeamId()));
            emailBuilder.team(team);
        }

        if (request.getType().equals("event_invite") && request.getEventId() != null) {
            Event event = eventRepository.findById(request.getEventId())
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + request.getEventId()));
            emailBuilder.event(event);
        }

        Email email = emailBuilder.build();
        Email savedEmail = emailRepository.save(email);

        log.info("Email sent from {} to {} with subject: {}",
                currentUser.getUserLogin(), recipientUsername, request.getSubject());

        return convertToDto(savedEmail);
    }

    public EmailResponseDto acceptInvitation(Long emailId, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Email email = emailRepository.findByIdAndUser(emailId, currentUser);

        if (email == null) {
            throw new ResourceNotFoundException("Email not found with id: " + emailId);
        }

        if (!email.getRecipientUser().equals(currentUser)) {
            throw new UnauthorizedException("You can only accept invitations sent to you");
        }

        if (!email.getType().equals(EmailType.TEAM_INVITE) && !email.getType().equals(EmailType.EVENT_INVITE)) {
            throw new IllegalArgumentException("Only invitations can be accepted");
        }

        email.setStatus(EmailStatus.ACCEPTED);
        email.setUnread(false);
        emailRepository.save(email);

        log.info("Invitation accepted by {} for email {}", currentUser.getUserLogin(), emailId);

        return EmailResponseDto.builder()
                .message("Invitation accepted successfully")
                .status("accepted")
                .emailId(emailId)
                .build();
    }

    public EmailResponseDto declineInvitation(Long emailId, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Email email = emailRepository.findByIdAndUser(emailId, currentUser);

        if (email == null) {
            throw new ResourceNotFoundException("Email not found with id: " + emailId);
        }

        if (!email.getRecipientUser().equals(currentUser)) {
            throw new UnauthorizedException("You can only decline invitations sent to you");
        }

        if (!email.getType().equals(EmailType.TEAM_INVITE) && !email.getType().equals(EmailType.EVENT_INVITE)) {
            throw new IllegalArgumentException("Only invitations can be declined");
        }

        email.setStatus(EmailStatus.DECLINED);
        email.setUnread(false);
        emailRepository.save(email);

        log.info("Invitation declined by {} for email {}", currentUser.getUserLogin(), emailId);

        return EmailResponseDto.builder()
                .message("Invitation declined successfully")
                .status("declined")
                .emailId(emailId)
                .build();
    }

    public void deleteEmail(Long emailId, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Email email = emailRepository.findByIdAndUser(emailId, currentUser);

        if (email == null) {
            throw new ResourceNotFoundException("Email not found with id: " + emailId);
        }

        // Помечаем как удаленное для текущего пользователя
        if (email.getSenderUser().equals(currentUser)) {
            email.setDeletedBySender(true);
        }

        if (email.getRecipientUser().equals(currentUser)) {
            email.setDeletedByRecipient(true);
        }

        // Если письмо удалено обеими сторонами, удаляем физически
        if (email.getDeletedBySender() && email.getDeletedByRecipient()) {
            emailRepository.delete(email);
            log.info("Email {} physically deleted", emailId);
        } else {
            emailRepository.save(email);
            log.info("Email {} marked as deleted by {}", emailId, currentUser.getUserLogin());
        }
    }

    public void markAsRead(Long emailId, Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Email email = emailRepository.findByIdAndUser(emailId, currentUser);

        if (email == null) {
            throw new ResourceNotFoundException("Email not found with id: " + emailId);
        }

        if (!email.getRecipientUser().equals(currentUser)) {
            throw new UnauthorizedException("You can only mark emails sent to you as read");
        }

        email.setUnread(false);
        emailRepository.save(email);

        log.info("Email {} marked as read by {}", emailId, currentUser.getUserLogin());
    }

    @Transactional(readOnly = true)
    public UnreadCountDto getUnreadCount(Principal principal) {
        User currentUser = userRepository.findByUserLogin(principal.getName()).orElseThrow(UserNotFoundException::new);
        Integer count = emailRepository.countUnreadEmails(currentUser);

        return UnreadCountDto.builder()
                .count(count)
                .build();
    }

    private EmailDto convertToDto(Email email) {
        EmailDto.EmailDtoBuilder builder = EmailDto.builder()
                .id(email.getId())
                .type(email.getType().getValue())
                .sender(email.getSender())
                .senderAvatar(email.getSenderAvatar())
                .recipient(email.getRecipient())
                .subject(email.getSubject())
                .message(email.getMessage())
                .date(email.getDate())
                .unread(email.getUnread())
                .status(email.getStatus().getValue());

        // Добавляем информацию о команде для team_invite
        if (email.getTeam() != null) {
            builder.teamInfo(TeamInfoDto.builder()
                    .id(email.getTeam().getId())
                    .name(email.getTeam().getTeamName())
                    .sport(String.valueOf(email.getTeam().getTeamType()))
                    .build());
        }

        // Добавляем информацию о событии для event_invite
        if (email.getEvent() != null) {
            builder.eventInfo(EventInfoDto.builder()
                    .id(email.getEvent().getId())
                    .name(email.getEvent().getEventName())
                    .date(email.getEvent().getEventDate())
                    .location(email.getEvent().getEventLocation())
                    .build());
        }

        return builder.build();
    }
}
