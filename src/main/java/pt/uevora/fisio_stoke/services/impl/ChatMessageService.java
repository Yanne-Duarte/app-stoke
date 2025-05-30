package pt.uevora.fisio_stoke.services.impl;

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
            // Get current user from the message sender username
            User currentUser = userRepository.findByUsername(message.getSender())
                .orElseThrow(() -> new RuntimeException("Remetente não encontrado: " + message.getSender()));
            
            // Determine the recipient based on the current user's role
            User recipient;
            if (currentUser.getPerfil() == Perfil.TECHNICAL) {
                // If sender is physiotherapist, recipient is the patient
                recipient = userRepository.findByUsername(message.getRecipient())
                    .orElseThrow(() -> new RuntimeException("Paciente não encontrado: " + message.getRecipient()));
            } else {
                // If sender is patient, recipient is their physiotherapist
                recipient = currentUser.getFisioterapeuta();
                if (recipient == null) {
                    throw new RuntimeException("O paciente não tem fisioterapeuta atribuído");
                }
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
            
            // Create a unique topic for this conversation
            String topic = String.format("/topic/chat/%d/%d", 
                Math.min(currentUser.getId(), recipient.getId()),
                Math.max(currentUser.getId(), recipient.getId()));
            
            // Send message to the specific topic
            messagingTemplate.convertAndSend(topic, message);
            
            // Also send to the general messages topic for debugging
            messagingTemplate.convertAndSend("/topic/messages", message);
            
        } catch (Exception e) {
            throw e;
        }
    }

    public List<ChatMessage> getChatHistory(Integer user1Id, Integer user2Id) {
        // Get current user from security context
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        // Verify if current user has permission to view these messages
        if (currentUser.getPerfil() == Perfil.TECHNICAL) {
            // Physiotherapists can view messages with their patients
            User otherUser = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado: " + user2Id));
            
            if (!otherUser.getFisioterapeuta().getId().equals(currentUser.getId())) {
                throw new RuntimeException("Acesso não autorizado ao histórico de chat");
            }
        } else {
            // Regular users can only view their own messages
            if (!currentUser.getId().equals(user1Id)) {
                throw new RuntimeException("Acesso não autorizado ao histórico de chat");
            }
        }
        
        // Get all messages for the current user
        List<ChatMessage> allMessages = chatMessageRepository.findChatHistory(currentUser);
        
        // Filter messages to only include those between user1Id and user2Id
        return allMessages.stream()
            .filter(message -> 
                (message.getSenderUser().getId().equals(user1Id) && message.getRecipientUser().getId().equals(user2Id)) ||
                (message.getSenderUser().getId().equals(user2Id) && message.getRecipientUser().getId().equals(user1Id))
            )
            .toList();
    }

    public void deleteMessage(Long messageId) {
        try {
            // Get current user from security context
            User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            
            // Find message and verify if user is the sender
            ChatMessage message = chatMessageRepository.findByIdAndSender(messageId, currentUser)
                .orElseThrow(() -> new RuntimeException("Mensagem não encontrada ou o utilizador não é o remetente"));
            
            // Delete the message
            chatMessageRepository.delete(message);
            
            // Notify other users about the deletion
            String topic = String.format("/topic/chat/%d/%d", 
                Math.min(message.getSenderUser().getId(), message.getRecipientUser().getId()),
                Math.max(message.getSenderUser().getId(), message.getRecipientUser().getId()));
            
            messagingTemplate.convertAndSend(topic, new ChatMessageDTO("sistema", "Mensagem eliminada"));
            
        } catch (Exception e) {
            throw e;
        }
    }
} 