package com.sporteventstournaments.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "highlights")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Highlight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HighlightType type; // VIDEO, PHOTO

    @Column(name = "media_url")
    private String mediaUrl;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    private String duration; // For videos, format: "MM:SS"

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer likes = 0;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer dislikes = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;

    @OneToMany(mappedBy = "highlight", cascade = CascadeType.ALL)
    private List<HighlightAuthor> authors;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum HighlightType {
        VIDEO, PHOTO
    }
}
