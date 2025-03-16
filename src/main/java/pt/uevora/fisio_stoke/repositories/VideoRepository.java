package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pt.uevora.fisio_stoke.entities.Video;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findAllByUserId(Integer userId);
    Optional<Video> findByIdAndUserId(Long id, Integer userId);
    void deleteByIdAndUserId(Long id, Integer userId);
} 