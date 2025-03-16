package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.uevora.fisio_stoke.dtos.NotificationCreateDTO;
import pt.uevora.fisio_stoke.dtos.NotificationResponseDTO;
import pt.uevora.fisio_stoke.entities.Notification;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.services.impl.NotificationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Endpoints for managing notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Create a new notification", description = "Cria uma nova notificação para um usuário específico")
    public ResponseEntity<NotificationResponseDTO> createNotification(
            @AuthenticationPrincipal User sender,
            @Valid @RequestBody NotificationCreateDTO dto) {
        Notification notification = notificationService.createNotification(
                dto.getTitle(),
                dto.getMessage(),
                dto.getRecipientUserId(),
                sender);
        return ResponseEntity.ok(NotificationResponseDTO.fromEntity(notification));
    }

    @GetMapping
    @Operation(summary = "Get all notifications for the current user")
    public ResponseEntity<List<NotificationResponseDTO>> getUserNotifications(
            @AuthenticationPrincipal User user) {
        List<NotificationResponseDTO> notifications = notificationService.getUserNotifications(user)
                .stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @Operation(summary = "Get unread notifications for the current user")
    public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(
            @AuthenticationPrincipal User user) {
        List<NotificationResponseDTO> notifications = notificationService.getUnreadNotifications(user)
                .stream()
                .map(NotificationResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count")
    @Operation(summary = "Get count of unread notifications")
    public ResponseEntity<Long> getUnreadCount(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(notificationService.getUnreadCount(user));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific notification")
    public ResponseEntity<NotificationResponseDTO> getNotification(@PathVariable Long id) {
        return ResponseEntity.ok(NotificationResponseDTO.fromEntity(notificationService.getNotification(id)));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long id) {
        return ResponseEntity.ok(NotificationResponseDTO.fromEntity(notificationService.markAsRead(id)));
    }

    @PatchMapping("/{id}/unread")
    @Operation(summary = "Mark a notification as unread")
    public ResponseEntity<NotificationResponseDTO> markAsUnread(@PathVariable Long id) {
        return ResponseEntity.ok(NotificationResponseDTO.fromEntity(notificationService.markAsUnread(id)));
    }

    @PatchMapping("/mark-all-read")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok().build();
    }
}