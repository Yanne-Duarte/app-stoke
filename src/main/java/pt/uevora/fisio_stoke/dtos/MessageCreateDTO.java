package pt.uevora.fisio_stoke.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageCreateDTO {
    @NotBlank(message = "Message content cannot be empty")
    private String content;

    @NotNull(message = "Recipient ID is required")
    private Integer recipientId;
} 