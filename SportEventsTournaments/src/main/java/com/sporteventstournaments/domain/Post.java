package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Entity(name = "post")
@Data
@Component
public class Post {
    @Id
    @SequenceGenerator(name = "postSeqGen", sequenceName = "post_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "postSeqGen")
    private Long id;

    @Column(name = "post_text")
    private String title;

    @Column(name = "description")
    private String content;

    @Column(name = "post_likes")
    private Long likes;

    @Column(name = "post_dislikes")
    private Long dislikes;

    @Column(name = "comment_number")
    private Long comments;

    @Column(name = "created_date")
    private LocalDateTime createdAt;

    @Column(name = "user_id")
    private Long userId;

}