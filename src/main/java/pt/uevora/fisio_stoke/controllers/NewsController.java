package pt.uevora.fisio_stoke.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pt.uevora.fisio_stoke.dtos.NewsDTO;
import pt.uevora.fisio_stoke.services.impl.NewsService;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NewsController {
    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    public ResponseEntity<List<NewsDTO>> getAllNews() {
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsDTO> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<NewsDTO> createNews(@RequestBody NewsDTO newsDTO) {
        return ResponseEntity.ok(newsService.createNews(newsDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<NewsDTO> updateNews(@PathVariable Long id, @RequestBody NewsDTO newsDTO) {
        return ResponseEntity.ok(newsService.updateNews(id, newsDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
        return ResponseEntity.ok().build();
    }
} 