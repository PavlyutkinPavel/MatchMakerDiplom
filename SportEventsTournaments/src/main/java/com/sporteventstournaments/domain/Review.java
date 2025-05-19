package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Entity(name = "reviews")
@Data
@Component
public class Review {

    @Id
    @SequenceGenerator(name = "reviewsSeqGen", sequenceName = "reviews_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "reviewsSeqGen")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "rating")
    private int rating;

    @Column(length = 1000, name = "review")
    private String review;

    @Column(name = "tournament_type")
    private String tournamentType;

    @Column(name = "verified")
    private boolean verified;

    @Column(name = "verification_token")
    private String verificationToken;

    @PrePersist
    public void prePersist() {
        this.date = LocalDate.now();
        this.avatar = name != null && !name.isEmpty() ? name.substring(0, 1).toUpperCase() : "?";
        this.verified = false;
        this.verificationToken = UUID.randomUUID().toString();
    }
}
