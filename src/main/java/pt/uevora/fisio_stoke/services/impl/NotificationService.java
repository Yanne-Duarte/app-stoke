package pt.uevora.fisio_stoke.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.uevora.fisio_stoke.entities.Notification;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.NotificationRepository;
import pt.uevora.fisio_stoke.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(String title, String message, Integer recipientUserId, User sender) {
        User recipient = userRepository.findById(recipientUserId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário destinatário não encontrado"));

        Notification notification = new Notification();
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setUser(recipient);
        notification.setRead(false);
        notification.setSender(sender);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false);
    }

    public Notification getNotification(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
    }

    public Notification markAsRead(Long id) {
        Notification notification = getNotification(id);
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public Notification markAsUnread(Long id) {
        Notification notification = getNotification(id);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsRead(user, false);
    }

    public void markAllAsRead(User user) {
        List<Notification> unreadNotifications = getUnreadNotifications(user);
        unreadNotifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
} 