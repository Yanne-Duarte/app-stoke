package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import pt.uevora.fisio_stoke.entities.Notification;

import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;
    private Integer userId;
    private Integer senderId;
    private String senderName; // Nome do remetente para exibição

    public static NotificationResponseDTO fromEntity(Notification notification) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setRead(notification.isRead());
        
        if (notification.getUser() != null) {
            dto.setUserId(notification.getUser().getId());
        }
        
        if (notification.getSender() != null) {
            dto.setSenderId(notification.getSender().getId());
            dto.setSenderName(notification.getSender().getFullName());
        }
        
        return dto;
    }
} 