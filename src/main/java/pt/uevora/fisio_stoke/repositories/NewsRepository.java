package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.uevora.fisio_stoke.entities.News;

public interface NewsRepository extends JpaRepository<News, Long> {
} 