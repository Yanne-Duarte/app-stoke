package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.Message;
import pt.uevora.fisio_stoke.entities.User;

import java.util.List;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
    List<Message> findBySenderOrRecipientOrderByCreatedAtDesc(User sender, User recipient);
    List<Message> findByRecipientAndReadAtIsNullOrderByCreatedAtDesc(User recipient);
} 