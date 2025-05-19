package com.sporteventstournaments.service;

import com.sporteventstournaments.domain.News;
import com.sporteventstournaments.domain.dto.NewsDTO;
import com.sporteventstournaments.exception.NewsNotFoundException;
import com.sporteventstournaments.repository.NewsRepository;
import com.sporteventstournaments.security.service.SecurityService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;
    private final SecurityService securityService;
    private final News news;

    public List<News> getNewsList() {
        return newsRepository.findAll();
    }

    public News getNews(Long id) {
        return newsRepository.findById(id).orElseThrow(NewsNotFoundException::new);
    }

    public News getNewsClub(Long clubId) {
        return newsRepository.findByClubNews(clubId).orElseThrow(NewsNotFoundException::new);
    }
    public void createNews(NewsDTO newsDTO, Principal principal) {
        int size = newsRepository.findAll().size();
        news.setId((long) (size+1));
        news.setTitle(newsDTO.getTitle());
        news.setNewsText(newsDTO.getNewsText());
        news.setUserId(securityService.getUserIdByLogin(principal.getName()));
        news.setPublicationDate(LocalDateTime.now());
        news.setTeamId(newsDTO.getTeamId());
        newsRepository.save(news);
    }

    public void updateNews(News news) {
        newsRepository.saveAndFlush(news);
    }

    @Transactional
    public void deleteNewsById(Long id){
        newsRepository.deleteById(id);
    }

}