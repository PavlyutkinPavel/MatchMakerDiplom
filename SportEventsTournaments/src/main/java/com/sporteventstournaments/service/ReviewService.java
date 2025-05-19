package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Review;
import com.sporteventstournaments.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ReviewService {

    private ReviewRepository reviewRepository;

    public Page<Review> getAllReviews(int offset, int limit, String filter, String sort) {
        Pageable pageable;
        Sort sortOrder = Sort.by("date").descending();

        if ("highest".equals(sort)) sortOrder = Sort.by("rating").descending();
        else if ("lowest".equals(sort)) sortOrder = Sort.by("rating").ascending();

        pageable = PageRequest.of(offset / limit, limit, sortOrder);

        Review probe = new Review();
        switch (filter != null ? filter : "") {
            case "verified":
                probe.setVerified(true);
                return reviewRepository.findAll(Example.of(probe), pageable);
            case "5star":
                probe.setRating(5);
                return reviewRepository.findAll(Example.of(probe), pageable);
            case "4star":
                probe.setRating(4);
                return reviewRepository.findAll(Example.of(probe), pageable);
            case "3below":
                List<Review> filtered = reviewRepository.findAll().stream()
                        .filter(r -> r.getRating() <= 3)
                        .skip(offset)
                        .limit(limit)
                        .toList();
                long count = reviewRepository.findAll().stream()
                        .filter(r -> r.getRating() <= 3)
                        .count();
                return new PageImpl<>(filtered, pageable, count);
            default:
                return reviewRepository.findAll(pageable);
        }
    }

    public Optional<Review> getReviewById(String id) {
        return reviewRepository.findById(id);
    }

    public Review addReview(Review review) {
        return reviewRepository.save(review);
    }

    public Optional<Review> verifyReview(String id, String token) {
        return reviewRepository.findById(id).map(r -> {
            if (r.getVerificationToken().equals(token)) {
                r.setVerified(true);
                return reviewRepository.save(r);
            }
            return null;
        });
    }
}
