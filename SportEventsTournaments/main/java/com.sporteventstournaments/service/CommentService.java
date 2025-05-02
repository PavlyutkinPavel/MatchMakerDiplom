package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Comment;
import com.sporteventstournaments.domain.Post;
import com.sporteventstournaments.domain.dto.CommentDTO;
import com.sporteventstournaments.exception.CommentNotFoundException;
import com.sporteventstournaments.exception.PostNotFoundException;
import com.sporteventstournaments.repository.CommentRepository;
import com.sporteventstournaments.repository.PostRepository;
import com.sporteventstournaments.security.service.SecurityService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final SecurityService securityService;
    private final PostRepository postRepository;
    private final Comment comment;

    public List<Comment> getComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getComment(Long id) {
        return commentRepository.findById(id);
    }

    public void createComment(CommentDTO commentDTO, Principal principal) {
        int size = commentRepository.findAll().size();
        comment.setId((long) (size+1));
        comment.setContent(commentDTO.getContent());
        comment.setLikes(0L);
        comment.setDislikes(0L);
        comment.setUserId(securityService.getUserIdByLogin(principal.getName()));
        comment.setPostId(commentDTO.getPostId());
        commentRepository.save(comment);

        Post post = postRepository.findById(comment.getPostId()).orElseThrow(PostNotFoundException::new);
        post.setComments(post.getComments()+1L);
        postRepository.saveAndFlush(post);
    }

    public void updateComment(Comment comment) {
        commentRepository.saveAndFlush(comment);
    }

    public void putLike(Long id) {
        Comment comment = getComment(id).orElseThrow(CommentNotFoundException::new);
        comment.setLikes(comment.getLikes()+1);
        commentRepository.saveAndFlush(comment);
    }
    public void putDislike(Long id) {
        Comment comment = getComment(id).orElseThrow(CommentNotFoundException::new);
        comment.setDislikes(comment.getDislikes()+1);
        commentRepository.saveAndFlush(comment);
    }

    public void deleteCommentById(Long id) {
        Post post = postRepository.findById(commentRepository.findById(id).orElseThrow(CommentNotFoundException::new).getPostId()).orElseThrow(PostNotFoundException::new);
        post.setComments(post.getComments()-1L);
        postRepository.saveAndFlush(post);
        commentRepository.deleteById(id);
    }

}