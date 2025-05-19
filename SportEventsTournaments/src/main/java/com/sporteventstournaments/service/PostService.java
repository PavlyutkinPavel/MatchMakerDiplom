package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.Post;
import com.sporteventstournaments.domain.dto.PostDTO;
import com.sporteventstournaments.repository.PostRepository;
import com.sporteventstournaments.exception.PostNotFoundException;
import com.sporteventstournaments.security.service.SecurityService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final SecurityService securityService;
    private final Post post;

    public List<Post> getPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPost(Long id) {
        return postRepository.findById(id);
    }

    public void createPost(PostDTO postDTO, Principal principal) {
        int size = postRepository.findAll().size();
        post.setId((long) (size+1));
        post.setCreatedAt(LocalDateTime.now());
        post.setComments(0L);
        post.setLikes(0L);
        post.setDislikes(0L);
        post.setTitle(postDTO.getTitle());
        post.setContent(postDTO.getContent());
        post.setUserId(securityService.getUserIdByLogin(principal.getName()));
        postRepository.save(post);
    }

    public void updatePost(Post post) {
        postRepository.saveAndFlush(post);
    }

    public void putLike(Long id) {
        Post post = getPost(id).orElseThrow(PostNotFoundException::new);
        post.setLikes(post.getLikes()+1);
        postRepository.saveAndFlush(post);
    }
    public void putDislike(Long id) {
        Post post = getPost(id).orElseThrow(PostNotFoundException::new);
        post.setDislikes(post.getDislikes()+1);
        postRepository.saveAndFlush(post);
    }

    public void deletePostById(Long id) {
        postRepository.deleteById(id);
    }

}