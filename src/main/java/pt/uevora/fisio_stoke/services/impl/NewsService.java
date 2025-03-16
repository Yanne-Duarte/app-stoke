package pt.uevora.fisio_stoke.services.impl;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import pt.uevora.fisio_stoke.dtos.NewsDTO;
import pt.uevora.fisio_stoke.entities.News;
import pt.uevora.fisio_stoke.repositories.NewsRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {
    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
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
        BeanUtils.copyProperties(newsDTO, news);
        news = newsRepository.save(news);
        return convertToDTO(news);
    }

    public NewsDTO updateNews(Long id, NewsDTO newsDTO) {
        News existingNews = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found"));
        
        BeanUtils.copyProperties(newsDTO, existingNews, "id");
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
        BeanUtils.copyProperties(news, dto);
        return dto;
    }
} 