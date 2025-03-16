package pt.uevora.fisio_stoke.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
@Schema(description = "DTO para criar uma nova notificação")
public class NotificationCreateDTO {
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be less than 255 characters")
    @Schema(description = "Título da notificação", example = "Nova mensagem")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 1000, message = "Message must be less than 1000 characters")
    @Schema(description = "Conteúdo da notificação", example = "Você tem uma nova mensagem")
    private String message;

    @NotNull(message = "Recipient user ID is required")
    @Schema(description = "ID do usuário que receberá a notificação", example = "1")
    private Integer recipientUserId;
} 