package pt.uevora.fisio_stoke.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoticeCreateDTO {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Body is required")
    private String body;
} 