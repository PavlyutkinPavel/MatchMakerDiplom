package com.sporteventstournaments.domain.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HighlightDto {
    private Long id;
    private String title;
    private String description;
    private String type; // VIDEO, PHOTO
    private String mediaUrl;
    private String thumbnailUrl;
    private String duration;
    private Integer likes;
    private Integer dislikes;
    private String sport; // Sport name
    private String category; // Category name
    private String tournament; // Tournament name
    private List<AuthorDto> authors;
    private Boolean userLiked; // For current user
    private Boolean userDisliked; // For current user

    @JsonFormat(pattern = "yyyy-MM-dd")
    private String createdAt; // Formatted date string
}
