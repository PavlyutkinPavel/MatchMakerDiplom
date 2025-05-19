package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Review;
import com.sporteventstournaments.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.*;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews(
            @RequestParam(defaultValue = "0") int offset,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(reviewService.getAllReviews(offset, limit, filter, sort).getContent());
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        if (review.getReview() == null || review.getReview().length() < 10) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(reviewService.addReview(review), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<Map<String, Serializable>> verifyReview(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String token = body.get("verificationToken");
        return reviewService.verifyReview(id, token)
                .map(r -> {
                    Map<String, Serializable> response = new HashMap<>();
                    response.put("id", r.getId());
                    response.put("verified", true);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable String id) {
        return reviewService.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
