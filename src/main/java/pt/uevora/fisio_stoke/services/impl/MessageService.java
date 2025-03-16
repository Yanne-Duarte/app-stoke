package pt.uevora.fisio_stoke.services.impl;

import org.springframework.stereotype.Service;
import pt.uevora.fisio_stoke.dtos.MessageCreateDTO;
import pt.uevora.fisio_stoke.entities.Message;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.enums.Perfil;
import pt.uevora.fisio_stoke.repositories.MessageRepository;
import pt.uevora.fisio_stoke.repositories.UserRepository;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    public Message createMessage(MessageCreateDTO dto, User sender) {
        User recipient = userRepository.findById(dto.getRecipientId())
                .orElseThrow(() -> new RuntimeException("Recipient not found"));

        validateMessagePermissions(sender, recipient);

        Message message = new Message()
                .setContent(dto.getContent())
                .setSender(sender)
                .setRecipient(recipient);

        return messageRepository.save(message);
    }

    private void validateMessagePermissions(User sender, User recipient) {
        // Rule 1: USER can only send messages to their assigned TECHNICAL
        if (sender.getPerfil() == Perfil.USER) {
            if (sender.getFisioterapeuta() == null || !sender.getFisioterapeuta().getId().equals(recipient.getId())) {
                throw new RuntimeException("You can only send messages to your assigned physiotherapist");
            }
            if (recipient.getPerfil() != Perfil.TECHNICAL) {
                throw new RuntimeException("The recipient must be a physiotherapist");
            }
        }
        
        // Rule 2: TECHNICAL can only send messages to their assigned USERs
        if (sender.getPerfil() == Perfil.TECHNICAL) {
            if (recipient.getPerfil() != Perfil.USER) {
                throw new RuntimeException("Technical can only send messages to users");
            }
            if (recipient.getFisioterapeuta() == null || !recipient.getFisioterapeuta().getId().equals(sender.getId())) {
                throw new RuntimeException("You can only send messages to your assigned patients");
            }
        }
    }

    public List<Message> getUserMessages(User user) {
        return messageRepository.findBySenderOrRecipientOrderByCreatedAtDesc(user, user);
    }

    public List<Message> getUnreadMessages(User user) {
        return messageRepository.findByRecipientAndReadAtIsNullOrderByCreatedAtDesc(user);
    }

    public Message markAsRead(Long messageId, User currentUser) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        if (!message.getRecipient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only mark your own messages as read");
        }

        if (message.getReadAt() == null) {
            message.setReadAt(new Date());
            return messageRepository.save(message);
        }

        return message;
    }

    public void markAllAsRead(User currentUser) {
        List<Message> unreadMessages = getUnreadMessages(currentUser);
        Date now = new Date();
        
        unreadMessages.forEach(message -> message.setReadAt(now));
        messageRepository.saveAll(unreadMessages);
    }
} 