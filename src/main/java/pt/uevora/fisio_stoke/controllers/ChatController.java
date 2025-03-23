package pt.uevora.fisio_stoke.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import pt.uevora.fisio_stoke.dtos.ChatMessageDTO;
import pt.uevora.fisio_stoke.services.impl.ChatMessageService;
import pt.uevora.fisio_stoke.entities.ChatMessage;
import java.util.List;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ChatController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final ChatMessageService chatMessageService;

    public ChatController(ChatMessageService chatMessageService) {
        this.chatMessageService = chatMessageService;
    }

    @MessageMapping("/send")
    public void sendMessage(ChatMessageDTO message) {
        try {
            logger.info("Received message: {}", message);
            if (message == null) {
                logger.error("Received null message");
                throw new IllegalArgumentException("Message cannot be null");
            }
            logger.info("Processing message from user: {}", message.getSender());
            
            // Processa e envia a mensagem de forma assíncrona
            chatMessageService.processAndSendMessage(message);
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/chats/history/{user1Id}/{user2Id}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
        @PathVariable Integer user1Id,
        @PathVariable Integer user2Id
    ) {
        try {
            logger.info("Fetching chat history for users: {} and {}", user1Id, user2Id);
            List<ChatMessage> history = chatMessageService.getChatHistory(user1Id, user2Id);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            logger.error("Error fetching chat history: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
