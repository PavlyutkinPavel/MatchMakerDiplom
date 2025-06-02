package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.dto.*;
import com.sporteventstournaments.domain.dto.request.*;
import com.sporteventstournaments.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/highlights-api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Configure as needed
public class HighlightsController {

    private final HighlightService highlightService;
    private final CategoryService categoryService;
    private final SportService sportService;
    private final TournamentService tournamentService;

    @GetMapping("/highlights")
    public ResponseEntity<List<HighlightDto>> getHighlights(
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {

        return ResponseEntity.ok(highlightService.findAll(sport, category, type, search));
    }

    @GetMapping("/highlights/{id}")
    public ResponseEntity<HighlightDto> getHighlight(@PathVariable Long id) {
        return ResponseEntity.ok(highlightService.findById(id));
    }

    @PostMapping("/highlights")
    public ResponseEntity<HighlightDto> createHighlight(
            @ModelAttribute HighlightCreateRequest request, Principal principal) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(highlightService.create(request, principal));
    }

    @PostMapping("/highlights/{id}/like")
    public ResponseEntity<Void> likeHighlight(
            @PathVariable Long id,
            @RequestBody LikeRequest request) {

        highlightService.likeHighlight(id, request.isLiked());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/highlights/{id}/dislike")
    public ResponseEntity<Void> dislikeHighlight(
            @PathVariable Long id,
            @RequestBody DislikeRequest request) {

        highlightService.dislikeHighlight(id, request.isDisliked());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getCategories() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/sports")
    public ResponseEntity<List<SportDto>> getSports() {
        return ResponseEntity.ok(sportService.findAll());
    }

    @GetMapping("/tournaments")
    public ResponseEntity<List<TournamentDto>> getTournaments() {
        return ResponseEntity.ok(tournamentService.findAll());
    }
}