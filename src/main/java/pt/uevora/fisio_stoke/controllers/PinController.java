package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import pt.uevora.fisio_stoke.entities.Pin;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.services.impl.PinService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pin")
@Tag(name = "PIN", description = "Endpoints para gestão de PINs")
public class PinController {
    private final PinService pinService;

    public PinController(PinService pinService) {
        this.pinService = pinService;
    }

    @PostMapping("/create")
    @Operation(summary = "Criar PIN", description = "Cria um novo PIN de 6 dígitos válido por 1 hora")
    public ResponseEntity<?> createPin() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) auth.getPrincipal();
            
            Pin pin = pinService.createPin(currentUser);
            
            Map<String, String> response = new HashMap<>();
            response.put("pin", pin.getPinCode());
            response.put("expiraEm", pin.getExpiresAt().toString());
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/validate")
    @Operation(summary = "Validar PIN", description = "Valida um PIN inserido")
    public ResponseEntity<?> validatePin(@RequestBody Map<String, String> request) {
        try {
            String pinCode = request.get("pin");
            if (pinCode == null || pinCode.length() != 6) {
                throw new RuntimeException("PIN inválido");
            }

            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) auth.getPrincipal();
            
            boolean isValid = pinService.validatePin(pinCode, currentUser);
            
            Map<String, Boolean> response = new HashMap<>();
            response.put("valido", isValid);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("erro", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
} 