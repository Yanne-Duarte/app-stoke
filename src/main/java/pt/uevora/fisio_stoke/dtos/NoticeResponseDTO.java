package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import pt.uevora.fisio_stoke.entities.Notice;

import java.time.LocalDateTime;

@Data
public class NoticeResponseDTO {
    private Long id;
    private String title;
    private String body;
    private LocalDateTime createdAt;
    private String creatorName;

    public static NoticeResponseDTO fromEntity(Notice notice) {
        NoticeResponseDTO dto = new NoticeResponseDTO();
        dto.setId(notice.getId());
        dto.setTitle(notice.getTitle());
        dto.setBody(notice.getBody());
        dto.setCreatedAt(notice.getCreatedAt());
        dto.setCreatorName(notice.getCreator().getFullName());
        return dto;
    }
} 