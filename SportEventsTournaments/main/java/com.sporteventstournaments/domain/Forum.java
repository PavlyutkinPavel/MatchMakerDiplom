package com.sporteventstournaments.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;

import java.util.Date;

@Entity(name = "forum")
@Data
public class Forum {
    @Id
    @SequenceGenerator(name = "forumSeqGen", sequenceName = "forum_id_seq", allocationSize = 1)
    @GeneratedValue(generator = "forumSeqGen")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "forum_members")
    private Long members;

    @Column(name = "date_creation")
    private Date dateCreation;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "post_id")
    private Long postId;

}