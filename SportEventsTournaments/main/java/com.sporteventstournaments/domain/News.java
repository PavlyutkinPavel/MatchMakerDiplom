package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Entity(name = "news")
@Data
public class News {
    @Id
    @SequenceGenerator(name = "newsSeqGen", sequenceName = "news_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "newsSeqGen")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "news_text")
    private String newsText;

    @Column(name = "publication_date")
    private LocalDateTime publicationDate;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "team_id")
    private Long teamId;
}