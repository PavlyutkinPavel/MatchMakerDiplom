package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.SequenceGenerator;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.hibernate.annotations.Comment;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Data
@Component
@Entity(name = "user_profiles")
public class UserProfile {

    @Id
    @SequenceGenerator(name = "userProfileSeqGen", sequenceName = "user_profiles_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "userProfileSeqGen")
    private Long id;

    @Column(name = "user_id")
    private Long user_id;

    @Column(name = "name")
    private String name;

    @Column(name = "username")
    @NotNull
    private String username;

    @Column(name = "bio")
    @NotNull
    private String bio;

    @Column(name = "location")
    private String location;

    @Column(name = "email")
    @NotNull
    private String email;

    @Column(name = "member_since")
    @NotNull
    private LocalDate memberSince;

    @Column(name = "avatar")
    private byte[] avatar;

    //sports,teams,achievements,upcomingEvents
}
