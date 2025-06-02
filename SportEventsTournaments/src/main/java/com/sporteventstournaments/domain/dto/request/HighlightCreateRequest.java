package com.sporteventstournaments.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class HighlightCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Type is required")
    private String type; // VIDEO or PHOTO

    @NotNull(message = "Media file is required")
    private MultipartFile mediaFile;

    private MultipartFile thumbnailFile; // Required for videos

    private String duration; // Required for videos

    @NotNull(message = "Tournament is required")
    private String tournament; // Tournament ID

    @NotNull(message = "Sport is required")
    private String sport; // Sport ID

    @NotNull(message = "Category is required")
    private String category; // Category ID
}
