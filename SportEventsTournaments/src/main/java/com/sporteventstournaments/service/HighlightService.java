package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.*;
import com.sporteventstournaments.domain.dto.AuthorDto;
import com.sporteventstournaments.domain.dto.HighlightDto;
import com.sporteventstournaments.domain.dto.request.HighlightCreateRequest;
import com.sporteventstournaments.exception.ResourceNotFoundException;
import com.sporteventstournaments.exception.UserNotFoundException;
import com.sporteventstournaments.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class HighlightService {

    private final HighlightRepository highlightRepository;
    private final SportRepository sportRepository;
    private final CategoryRepository categoryRepository;
    private final TournamentRepository tournamentRepository;
    private final AuthorRepository authorRepository;
    private final HighlightAuthorRepository highlightAuthorRepository;
    private final FileStorageService fileStorageService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");
    private final UserRepository userRepository;

    public List<HighlightDto> findAll(String sport, String category, String type, String search) {
        Long sportId = sport != null && !sport.equals("all") ? Long.valueOf(sport) : null;
        Long categoryId = category != null && !category.equals("all") ? Long.valueOf(category) : null;
        Highlight.HighlightType typeEnum = type != null && !type.equals("all") ?
                Highlight.HighlightType.valueOf(type.toUpperCase()) : null;

        List<Highlight> highlights = highlightRepository.findFilteredHighlights(
                sportId, categoryId, typeEnum, search
        );

        return highlights.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public HighlightDto findById(Long id) {
        Highlight highlight = highlightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight not found with id: " + id));

        return convertToDto(highlight);
    }

    public HighlightDto create(HighlightCreateRequest request, Principal principal) {
        // Validate and get related entities
        Sport sport = sportRepository.findById(Long.valueOf(request.getSport()))
                .orElseThrow(() -> new ResourceNotFoundException("Sport not found"));

        Category category = categoryRepository.findById(Long.valueOf(request.getCategory()))
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Tournament tournament = tournamentRepository.findById(Long.valueOf(request.getTournament()))
                .orElseThrow(() -> new ResourceNotFoundException("Tournament not found"));

        // Upload files
        String mediaUrl = fileStorageService.storeFile(request.getMediaFile());
        String thumbnailUrl = null;

        if (request.getThumbnailFile() != null && !request.getThumbnailFile().isEmpty()) {
            thumbnailUrl = fileStorageService.storeFile(request.getThumbnailFile());
        }

        // Create highlight
        Highlight highlight = Highlight.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .type(Highlight.HighlightType.valueOf(request.getType().toUpperCase()))
                .mediaUrl(mediaUrl)
                .thumbnailUrl(thumbnailUrl)
                .duration(request.getDuration())
                .sport(sport)
                .category(category)
                .tournament(tournament)
                .likes(0)
                .dislikes(0)
                .build();

        highlight = highlightRepository.save(highlight);



        // Create default author (you might want to get this from security context)
        User defaultAuthor = userRepository.findByUserLogin(principal.getName())
                .orElseThrow(UserNotFoundException::new);


        HighlightAuthor highlightAuthor = HighlightAuthor.builder()
                .highlight(highlight)
                .user(defaultAuthor)
                .build();

        highlightAuthorRepository.save(highlightAuthor);

        return convertToDto(highlight);
    }

    public void likeHighlight(Long id, boolean liked) {
        Highlight highlight = highlightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight not found with id: " + id));

        if (liked) {
            highlight.setLikes(highlight.getLikes() + 1);
        } else {
            highlight.setLikes(Math.max(0, highlight.getLikes() - 1));
        }

        highlightRepository.save(highlight);
    }

    public void dislikeHighlight(Long id, boolean disliked) {
        Highlight highlight = highlightRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Highlight not found with id: " + id));

        if (disliked) {
            highlight.setDislikes(highlight.getDislikes() + 1);
        } else {
            highlight.setDislikes(Math.max(0, highlight.getDislikes() - 1));
        }

        highlightRepository.save(highlight);
    }

    private HighlightDto convertToDto(Highlight highlight) {
        List<AuthorDto> authors;
        if(highlight.getAuthors() != null){
             authors = highlight.getAuthors().stream()
                    .map(ha -> AuthorDto.builder()
                            .id(ha.getUser().getId())
                            .name(ha.getUser().getUserLogin())
                            .build())
                    .collect(Collectors.toList());
        } else{
            authors = new ArrayList<>();
        }

        return HighlightDto.builder()
                .id(highlight.getId())
                .title(highlight.getTitle())
                .description(highlight.getDescription())
                .type(highlight.getType().name())
                .mediaUrl(highlight.getMediaUrl())
                .thumbnailUrl(highlight.getThumbnailUrl())
                .duration(highlight.getDuration())
                .likes(highlight.getLikes())
                .dislikes(highlight.getDislikes())
                .sport(highlight.getSport().getName())
                .category(highlight.getCategory().getName())
                .tournament(highlight.getTournament().getName())
                .authors(authors)
                .userLiked(false) // TODO: Implement user-specific logic
                .userDisliked(false) // TODO: Implement user-specific logic
                .createdAt(highlight.getCreatedAt().format(DATE_FORMATTER))
                .build();
    }
}
