package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
} 