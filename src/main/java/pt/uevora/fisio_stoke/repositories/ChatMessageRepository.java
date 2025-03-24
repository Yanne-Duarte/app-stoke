package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.uevora.fisio_stoke.entities.ChatMessage;
import pt.uevora.fisio_stoke.entities.User;

import java.util.List;
import java.util.Optional;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderUser = :user1 AND m.recipientUser = :user2) OR " +
           "(m.senderUser = :user2 AND m.recipientUser = :user1) " +
           "ORDER BY m.createdAt ASC")
    List<ChatMessage> findChatHistory(@Param("user1") User user1, @Param("user2") User user2);

    @Query("SELECT m FROM ChatMessage m WHERE m.id = :messageId AND m.senderUser = :user")
    Optional<ChatMessage> findByIdAndSender(@Param("messageId") Long messageId, @Param("user") User user);
} 