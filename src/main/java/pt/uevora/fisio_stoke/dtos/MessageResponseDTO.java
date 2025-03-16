package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import pt.uevora.fisio_stoke.entities.Message;

import java.util.Date;

@Data
public class MessageResponseDTO {
    private Long id;
    private String content;
    private Integer senderId;
    private String senderName;
    private Integer recipientId;
    private String recipientName;
    private Date readAt;
    private Date createdAt;

    public static MessageResponseDTO fromEntity(Message message) {
        MessageResponseDTO dto = new MessageResponseDTO();
        dto.setId(message.getId());
        dto.setContent(message.getContent());
        dto.setSenderId(message.getSender().getId());
        dto.setSenderName(message.getSender().getFullName());
        dto.setRecipientId(message.getRecipient().getId());
        dto.setRecipientName(message.getRecipient().getFullName());
        dto.setReadAt(message.getReadAt());
        dto.setCreatedAt(message.getCreatedAt());
        return dto;
    }
} 