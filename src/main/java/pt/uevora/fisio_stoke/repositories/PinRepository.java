package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.Pin;
import pt.uevora.fisio_stoke.entities.User;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PinRepository extends CrudRepository<Pin, Long> {
    Optional<Pin> findByPinCodeAndUserAndExpiresAtAfterAndUsedFalse(String pinCode, User user, LocalDateTime now);
    Optional<Pin> findFirstByUserAndExpiresAtAfterAndUsedFalseOrderByCreatedAtDesc(User user, LocalDateTime now);
    Optional<Pin> findByPinCodeAndExpiresAtAfterAndUsedFalse(String pinCode, LocalDateTime now);
} 