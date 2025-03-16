package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.uevora.fisio_stoke.dtos.MessageCreateDTO;
import pt.uevora.fisio_stoke.dtos.MessageResponseDTO;
import pt.uevora.fisio_stoke.entities.Message;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.services.impl.MessageService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@Tag(name = "Messages", description = "Endpoints for managing messages between users and physiotherapists")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping
    @Operation(
        summary = "Send a new message",
        description = "Send a message to another user following the permission rules:\n" +
                     "1. Users can only send messages to their assigned physiotherapist\n" +
                     "2. Physiotherapists can only send messages to their assigned patients"
    )
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @AuthenticationPrincipal User sender,
            @Valid @RequestBody MessageCreateDTO dto) {
        Message message = messageService.createMessage(dto, sender);
        return ResponseEntity.ok(MessageResponseDTO.fromEntity(message));
    }

    @GetMapping
    @Operation(
        summary = "Get user messages",
        description = "Get all messages where the current user is either the sender or recipient"
    )
    public ResponseEntity<List<MessageResponseDTO>> getUserMessages(@AuthenticationPrincipal User user) {
        List<MessageResponseDTO> messages = messageService.getUserMessages(user)
                .stream()
                .map(MessageResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    @Operation(
        summary = "Get unread messages",
        description = "Get all unread messages where the current user is the recipient"
    )
    public ResponseEntity<List<MessageResponseDTO>> getUnreadMessages(@AuthenticationPrincipal User user) {
        List<MessageResponseDTO> messages = messageService.getUnreadMessages(user)
                .stream()
                .map(MessageResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    @PatchMapping("/{id}/read")
    @Operation(
        summary = "Mark message as read",
        description = "Mark a specific message as read. Only the recipient can mark a message as read."
    )
    public ResponseEntity<MessageResponseDTO> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        Message message = messageService.markAsRead(id, user);
        return ResponseEntity.ok(MessageResponseDTO.fromEntity(message));
    }

    @PatchMapping("/mark-all-read")
    @Operation(
        summary = "Mark all messages as read",
        description = "Mark all unread messages for the current user as read"
    )
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal User user) {
        messageService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
} 