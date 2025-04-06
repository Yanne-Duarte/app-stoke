package pt.uevora.fisio_stoke.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import pt.uevora.fisio_stoke.dtos.NewsDTO;
import pt.uevora.fisio_stoke.entities.News;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.NewsRepository;
import pt.uevora.fisio_stoke.repositories.UserRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {
    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public NewsService(NewsRepository newsRepository, UserRepository userRepository) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
    }

    public List<NewsDTO> getAllNews() {
        return newsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public NewsDTO getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));
        return convertToDTO(news);
    }

    public NewsDTO createNews(NewsDTO newsDTO) {
        News news = new News();
        
        // Copiar apenas título e conteúdo do DTO
        news.setTitle(newsDTO.getTitle());
        news.setContent(newsDTO.getContent());
        
        // Definir status como true por padrão
        news.setStatus(true);
        
        // Obter informações do autor a partir do token
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Definir informações do autor
        news.setAuthorId(author.getId().toString());
        news.setAuthorName(author.getFullName());
        news.setAuthorUsername(author.getUsername());
        
        // Salvar a notícia
        news = newsRepository.save(news);
        return convertToDTO(news);
    }

    public NewsDTO updateNews(Long id, NewsDTO newsDTO) {
        News existingNews = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));
        
        // Atualizar apenas título e conteúdo
        existingNews.setTitle(newsDTO.getTitle());
        existingNews.setContent(newsDTO.getContent());
        
        existingNews = newsRepository.save(existingNews);
        return convertToDTO(existingNews);
    }

    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new RuntimeException("News not found");
        }
        newsRepository.deleteById(id);
    }

    private NewsDTO convertToDTO(News news) {
        NewsDTO dto = new NewsDTO();
        BeanUtils.copyProperties(news, dto, "createdAt");
        dto.setCreatedAt(news.getCreatedAt().format(dateFormatter));
        return dto;
    }
} 