package com.sporteventstournaments.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Schema(description = "Описание пользователя")
@Data
@Entity(name = "users")
public class User {
    @Schema(description = "Это уникальный идентификатор пользователя")
    @Id
    @SequenceGenerator(name = "userSeqGen", sequenceName = "users_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "userSeqGen")
    private Long id;

    @Column(name = "first_name")
    @NotNull
    private String firstName;

    @Column(name = "last_name")
    @NotNull
    private String lastName;

    @Column(name = "user_login")
    @NotNull
    private String userLogin;

    @Column(name = "created")
    private LocalDateTime createdAt;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "in_game_role")
    @Enumerated(EnumType.STRING)
    private InGameRole inGameRole;

    @OneToMany(mappedBy = "senderUser", cascade = CascadeType.ALL)
    @JsonManagedReference("email-sender")
    private List<Email> sentEmails;

    @OneToMany(mappedBy = "recipientUser", cascade = CascadeType.ALL)
    @JsonManagedReference("email-recipient")
    private List<Email> receivedEmails;

}
