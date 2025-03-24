package pt.uevora.fisio_stoke.services.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pt.uevora.fisio_stoke.dtos.ChatMessageDTO;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.entities.ChatMessage;
import pt.uevora.fisio_stoke.repositories.UserRepository;
import pt.uevora.fisio_stoke.repositories.ChatMessageRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import pt.uevora.fisio_stoke.enums.Perfil;
import pt.uevora.fisio_stoke.services.impl.JwtService;

import java.util.List;

@Service
public class ChatMessageService {
    private static final Logger logger = LoggerFactory.getLogger(ChatMessageService.class);
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final JwtService jwtService;

    public ChatMessageService(
        SimpMessagingTemplate messagingTemplate, 
        UserRepository userRepository,
        ChatMessageRepository chatMessageRepository,
        JwtService jwtService
    ) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.jwtService = jwtService;
    }

    @Async
    public void processAndSendMessage(ChatMessageDTO message) {
        try {
            logger.info("Processing message asynchronously: {}", message);
            
            // Get current user from the message sender username
            User currentUser = userRepository.findByUsername(message.getSender())
                .orElseThrow(() -> new RuntimeException("Sender not found: " + message.getSender()));
            
            logger.info("Current user: {} with role: {}", currentUser.getUsername(), currentUser.getPerfil());
            
            // Determine the recipient based on the current user's role
            User recipient;
            if (currentUser.getPerfil() == Perfil.TECHNICAL) {
                // If sender is physiotherapist, recipient is the patient
                recipient = userRepository.findByUsername(message.getRecipient())
                    .orElseThrow(() -> new RuntimeException("Patient not found: " + message.getRecipient()));
                logger.info("Physiotherapist sending to patient: {}", recipient.getUsername());
            } else {
                // If sender is patient, recipient is their physiotherapist
                recipient = currentUser.getFisioterapeuta();
                if (recipient == null) {
                    throw new RuntimeException("Patient has no assigned physiotherapist");
                }
                logger.info("Patient sending to physiotherapist: {}", recipient.getUsername());
            }
            
            // Save message to database
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(message.getSender());
            chatMessage.setRecipient(message.getRecipient());
            chatMessage.setContent(message.getContent());
            chatMessage.setTimestamp(message.getTimestamp());
            chatMessage.setSenderUser(currentUser);
            chatMessage.setRecipientUser(recipient);
            chatMessageRepository.save(chatMessage);
            logger.info("Message saved to database with ID: {}", chatMessage.getId());
            
            // Create a unique topic for this conversation
            String topic = String.format("/topic/chat/%d/%d", 
                Math.min(currentUser.getId(), recipient.getId()),
                Math.max(currentUser.getId(), recipient.getId()));
            
            // Send message to the specific topic
            messagingTemplate.convertAndSend(topic, message);
            logger.info("Message sent to topic: {} from {} to {}", 
                topic, currentUser.getUsername(), recipient.getUsername());
            
            // Also send to the general messages topic for debugging
            messagingTemplate.convertAndSend("/topic/messages", message);
            logger.info("Message also sent to general topic for debugging");
            
        } catch (Exception e) {
            logger.error("Error processing message: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<ChatMessage> getChatHistory(Integer user1Id, Integer user2Id) {
        User user1 = userRepository.findById(user1Id)
            .orElseThrow(() -> new RuntimeException("User not found: " + user1Id));
        User user2 = userRepository.findById(user2Id)
            .orElseThrow(() -> new RuntimeException("User not found: " + user2Id));
        return chatMessageRepository.findChatHistory(user1, user2);
    }

    public void deleteMessage(Long messageId) {
        try {
            // Get current user from security context
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            // Find message and verify if user is the sender
            ChatMessage message = chatMessageRepository.findByIdAndSender(messageId, currentUser)
                .orElseThrow(() -> new RuntimeException("Message not found or user is not the sender"));
            
            // Delete the message
            chatMessageRepository.delete(message);
            logger.info("Message {} deleted by user {}", messageId, currentUser.getUsername());
            
            // Notify other users about the deletion
            String topic = String.format("/topic/chat/%d/%d", 
                Math.min(message.getSenderUser().getId(), message.getRecipientUser().getId()),
                Math.max(message.getSenderUser().getId(), message.getRecipientUser().getId()));
            
            messagingTemplate.convertAndSend(topic, new ChatMessageDTO("system", "Message deleted"));
            
        } catch (Exception e) {
            logger.error("Error deleting message: {}", e.getMessage(), e);
            throw e;
        }
    }
} 