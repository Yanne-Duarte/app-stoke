package pt.uevora.fisio_stoke.services.impl;

import org.springframework.stereotype.Service;
import pt.uevora.fisio_stoke.entities.Pin;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.PinRepository;
import pt.uevora.fisio_stoke.enums.Perfil;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class PinService {
    private final PinRepository pinRepository;
    private final Random random = new Random();

    public PinService(PinRepository pinRepository) {
        this.pinRepository = pinRepository;
    }

    public Pin createPin(User user) {
        if (user.getPerfil() != Perfil.TECHNICAL) {
            throw new RuntimeException("Apenas utilizadores técnicos podem criar PINs");
        }

        // Gerar um PIN de 6 dígitos
        String pinCode = String.format("%06d", random.nextInt(1000000));
        
        // Criar PIN com expiração de 1 hora
        Pin pin = new Pin();
        pin.setPinCode(pinCode);
        pin.setUser(user);
        pin.setExpiresAt(LocalDateTime.now().plusHours(1));
        pin.setUsed(false);

        return pinRepository.save(pin);
    }

    public boolean validatePin(String pinCode, User user) {
        Optional<Pin> pinOpt = pinRepository.findByPinCodeAndUserAndExpiresAtAfterAndUsedFalse(
            pinCode, 
            user, 
            LocalDateTime.now()
        );

        if (pinOpt.isPresent()) {
            Pin pin = pinOpt.get();
            pin.setUsed(true);
            pinRepository.save(pin);
            return true;
        }

        return false;
    }

    public Pin getLatestPin(User user) {
        return pinRepository.findFirstByUserAndExpiresAtAfterAndUsedFalseOrderByCreatedAtDesc(
            user, 
            LocalDateTime.now()
        ).orElse(null);
    }
} 