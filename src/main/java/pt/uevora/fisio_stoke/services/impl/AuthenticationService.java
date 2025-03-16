package pt.uevora.fisio_stoke.services.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import pt.uevora.fisio_stoke.dtos.LoginUserDto;
import pt.uevora.fisio_stoke.dtos.RegisterUserDto;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.UserRepository;
import pt.uevora.fisio_stoke.enums.Perfil;

import java.util.ArrayList;
import java.util.List;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User signup(RegisterUserDto input) {
        User fisioterapeuta = null;
        if (input.getPerfil() == Perfil.USER && input.getFisioterapeutaId() != null) {
            fisioterapeuta = userRepository.findById(input.getFisioterapeutaId())
                .orElseThrow(() -> new RuntimeException("Fisioterapeuta não encontrado"));
            
            if (fisioterapeuta.getPerfil() != Perfil.TECHNICAL) {
                throw new RuntimeException("O profissional selecionado não é um fisioterapeuta");
            }
        }

        var user = new User()
                .setFullName(input.getFullName())
                .setUsername(input.getUsername())
                .setPassword(passwordEncoder.encode(input.getPassword()))
                .setBirthdate(input.getBirthdate())
                .setPerfil(input.getPerfil())
                .setPlano(input.getPlano())
                .setFisioterapeuta(fisioterapeuta);

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {
        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                input.getUsername(),
                input.getPassword()
            )
        );
        
        // Set the authentication in the SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Return the authenticated user
        return userRepository.findByUsername(input.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }

    public void logout() {
        // Clear the authentication from the security context
        SecurityContextHolder.clearContext();
    }
}
