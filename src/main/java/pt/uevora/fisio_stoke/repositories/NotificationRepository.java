package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.Notification;
import pt.uevora.fisio_stoke.entities.User;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, boolean isRead);
    long countByUserAndIsRead(User user, boolean isRead);
} 