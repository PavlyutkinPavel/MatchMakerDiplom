package com.sporteventstournaments.controller;

import com.sporteventstournaments.domain.Comment;
import com.sporteventstournaments.domain.dto.CommentDTO;
import com.sporteventstournaments.exception.CommentNotFoundException;
import com.sporteventstournaments.security.service.SecurityService;
import com.sporteventstournaments.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;

@Tag(name = "Comment Controller", description = "makes all operations with comments")
@RestController
@AllArgsConstructor
@RequestMapping("/comment")
public class CommentController {
    private final CommentService commentService;
    private final SecurityService securityService;

    private static HashMap<String, Long> statistics = new HashMap<>();

    @Operation(summary = "get all comments(for all authorized users)")
    @GetMapping
    public ResponseEntity<List<Comment>> getComments() {
        List<Comment> comments = commentService.getComments();
        if (comments.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(comments, HttpStatus.OK);
        }
    }

    @Operation(summary = "get specific comment(for all authorized users)")
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getComment(@PathVariable Long id) {
        Comment comment = commentService.getComment(id).orElseThrow(CommentNotFoundException::new);
        return new ResponseEntity<>(comment, HttpStatus.OK);
    }

    @Operation(summary = "create comment(for all authorized users)")
    @PostMapping
    public ResponseEntity<HttpStatus> createComment(@RequestBody CommentDTO commentDTO, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        commentService.createComment(commentDTO, principal);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @Operation(summary = "update comments(for all admins and comment's author)")
    @PutMapping
    public ResponseEntity<HttpStatus> updateComment(@RequestBody Comment comment, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName()) || (comment.getUserId() == securityService.getUserIdByLogin(principal.getName()))) {
            commentService.updateComment(comment);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "delete comments(for all admins and comment's author)")
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteComment(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (securityService.checkIfAdmin(principal.getName()) || (getComment(id).getBody().getUserId() == securityService.getUserIdByLogin(principal.getName()))) {
            commentService.deleteCommentById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }

    @Operation(summary = "get comment statistic (for all authorized users)")
    @GetMapping("/statistics/{id}")
    public ResponseEntity<HashMap<String, Long>> getCommentStatistics(@PathVariable Long id) {
        Comment comment = commentService.getComment(id).orElseThrow(CommentNotFoundException::new);

        statistics.put("Likes: ", comment.getLikes());
        statistics.put("Dislikes: ", comment.getDislikes());

        return new ResponseEntity<>(statistics, HttpStatus.OK);
    }

    @Operation(summary = "put like to comment(for all users)")
    @PutMapping("/like/{id}")
    public ResponseEntity<HashMap<String, Long>> putLike(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        commentService.putLike(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "put dislike to comment(for all users)")
    @PutMapping("/dislike/{id}")
    public ResponseEntity<HashMap<String, Long>> putDislike(@PathVariable Long id, Principal principal) {
        if(principal == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        commentService.putDislike(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
