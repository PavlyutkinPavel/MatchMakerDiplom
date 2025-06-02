package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.dto.*;
import com.sporteventstournaments.service.EmailService;
import lombok.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.security.Principal;


@RestController
@RequestMapping("/emails")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EmailController {

    private final EmailService emailService;

    /**
     * Получить входящие письма пользователя
     */
    @GetMapping("/received")
    public ResponseEntity<Page<EmailDto>> getReceivedEmails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Boolean unread, Principal principal) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EmailDto> emails = emailService.getReceivedEmails(pageable, type, unread, principal);
        return ResponseEntity.ok(emails);
    }

    /**
     * Получить отправленные письма пользователя
     */
    @GetMapping("/sent")
    public ResponseEntity<Page<EmailDto>> getSentEmails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status, Principal principal) {

        Pageable pageable = PageRequest.of(page, size);
        Page<EmailDto> emails = emailService.getSentEmails(pageable, type, status, principal);
        return ResponseEntity.ok(emails);
    }

    /**
     * Получить конкретное письмо по ID
     */
    @GetMapping("/{emailId}")
    public ResponseEntity<EmailDto> getEmailById(@PathVariable Long emailId, Principal principal) {
        EmailDto email = emailService.getEmailById(emailId, principal);
        return ResponseEntity.ok(email);
    }

    /**
     * Отправить новое письмо
     */
    @PostMapping("/send")
    public ResponseEntity<EmailDto> sendEmail(@Valid @RequestBody SendEmailRequest request, Principal principal) {
        EmailDto sentEmail = emailService.sendEmail(request, principal);
        return ResponseEntity.ok(sentEmail);
    }

    /**
     * Принять приглашение (для team_invite и event_invite)
     */
    @PostMapping("/{emailId}/accept")
    public ResponseEntity<EmailResponseDto> acceptInvitation(@PathVariable Long emailId, Principal principal) {
        EmailResponseDto response = emailService.acceptInvitation(emailId, principal);
        return ResponseEntity.ok(response);
    }

    /**
     * Отклонить приглашение
     */
    @PostMapping("/{emailId}/decline")
    public ResponseEntity<EmailResponseDto> declineInvitation(@PathVariable Long emailId, Principal principal) {
        EmailResponseDto response = emailService.declineInvitation(emailId, principal);
        return ResponseEntity.ok(response);
    }

    /**
     * Удалить письмо
     */
    @DeleteMapping("/{emailId}")
    public ResponseEntity<Void> deleteEmail(@PathVariable Long emailId, Principal principal) {
        emailService.deleteEmail(emailId, principal);
        return ResponseEntity.noContent().build();
    }

    /**
     * Пометить письмо как прочитанное
     */
    @PatchMapping("/{emailId}/mark-read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long emailId, Principal principal) {
        emailService.markAsRead(emailId, principal);
        return ResponseEntity.ok().build();
    }

    /**
     * Получить количество непрочитанных писем
     */
    @GetMapping("/unread-count")
    public ResponseEntity<UnreadCountDto> getUnreadCount(Principal principal) {
        UnreadCountDto count = emailService.getUnreadCount(principal);
        return ResponseEntity.ok(count);
    }
}

