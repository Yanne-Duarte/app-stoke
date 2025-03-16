package pt.uevora.fisio_stoke.services.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import pt.uevora.fisio_stoke.dtos.RegisterUserDto;
import pt.uevora.fisio_stoke.dtos.UpdateUserByAdminDto;
import pt.uevora.fisio_stoke.dtos.UpdateUserByUserDto;
import pt.uevora.fisio_stoke.dtos.UserDTO;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.UserRepository;
import pt.uevora.fisio_stoke.enums.Perfil;
import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserDTO> getUsersByProfile(Perfil perfil) {
        System.out.println("Getting users by profile: " + perfil);
        
        // Get current user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = (User) auth.getPrincipal();
        System.out.println("Current user: " + currentUser.getUsername() + " with role: " + currentUser.getPerfil());
        
        List<User> users = userRepository.findByPerfil(perfil);
        System.out.println("Found " + users.size() + " users with profile " + perfil);
        
        // If current user is TECHNICAL, filter users to show only those assigned to them
        if (currentUser.getPerfil() == Perfil.TECHNICAL) {
            users = users.stream()
                .filter(user -> user.getFisioterapeuta() != null && 
                              user.getFisioterapeuta().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
            System.out.println("After filtering for technical user: " + users.size() + " users");
        }
        
        return users.stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getBirthdate(),
                null,
                null,
                user.getPerfil().toString(),
                user.getPlano(),
                user.getFisioterapeuta() != null ? user.getFisioterapeuta().getId() : null,
                user.getFisioterapeuta() != null ? user.getFisioterapeuta().getFullName() : null
            ))
            .toList();
    }

    public List<User> allUsers(String fullName, String username, String perfil, LocalDate birthdate, String plano, String fisioterapeuta) {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(user -> {
            boolean matches = true;
            
            if (fullName != null && !fullName.isEmpty()) {
                matches = user.getFullName().toLowerCase().contains(fullName.toLowerCase());
            }
            if (matches && username != null && !username.isEmpty()) {
                matches = user.getUsername().toLowerCase().contains(username.toLowerCase());
            }
            if (matches && perfil != null && !perfil.isEmpty()) {
                matches = user.getPerfil().toString().equals(perfil);
            }
            if (matches && birthdate != null) {
                matches = user.getBirthdate().equals(birthdate);
            }
            if (matches && plano != null && !plano.isEmpty()) {
                matches = user.getPlano().toLowerCase().contains(plano.toLowerCase());
            }
            if (matches && fisioterapeuta != null && !fisioterapeuta.isEmpty()) {
                matches = user.getFisioterapeuta() != null && 
                         user.getFisioterapeuta().getFullName().toLowerCase().contains(fisioterapeuta.toLowerCase());
            }
            
            if (matches) {
                users.add(user);
            }
        });
        
        return users;
    }

    public User registerUser(RegisterUserDto registerUserDto) {
        // Se for um usuário comum, valida e busca o fisioterapeuta
        User fisioterapeuta = null;
        if (registerUserDto.getPerfil() == Perfil.USER && registerUserDto.getFisioterapeutaId() != null) {
            fisioterapeuta = userRepository.findById(registerUserDto.getFisioterapeutaId())
                .orElseThrow(() -> new RuntimeException("Fisioterapeuta não encontrado"));
            
            if (fisioterapeuta.getPerfil() != Perfil.TECHNICAL) {
                throw new RuntimeException("O profissional selecionado não é um fisioterapeuta");
            }
        }

        User user = new User()
            .setFullName(registerUserDto.getFullName())
            .setUsername(registerUserDto.getUsername())
            .setPassword(passwordEncoder.encode(registerUserDto.getPassword()))
            .setBirthdate(registerUserDto.getBirthdate())
            .setPerfil(registerUserDto.getPerfil())
            .setPlano(registerUserDto.getPlano())
            .setFisioterapeuta(fisioterapeuta)
            .setStatus(true);

        return userRepository.save(user);
    }

    public User toggleUserStatus(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        
        user.setStatus(!user.getStatus()); // Inverte o status atual
        return userRepository.save(user);
    }

    public User updateUserByUser(Integer userId, UpdateUserByUserDto dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        
        user.setFullName(dto.getFullName())
            .setBirthdate(dto.getBirthdate());
        
        return userRepository.save(user);
    }

    public User updateUserByAdmin(Integer userId, UpdateUserByAdminDto dto) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        
        user.setFullName(dto.getFullName())
            .setBirthdate(dto.getBirthdate())
            .setPerfil(dto.getPerfil());
            
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        
        return userRepository.save(user);
    }

    public List<Map<String, Object>> getAllTechnicalUsers() {
        return userRepository.findByPerfil(Perfil.TECHNICAL)
            .stream()
            .map(user -> {
                Map<String, Object> technicalUser = new HashMap<>();
                technicalUser.put("id", user.getId());
                technicalUser.put("fullName", user.getFullName());
                return technicalUser;
            })
            .collect(Collectors.toList());
    }

    public void deleteUser(Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        userRepository.delete(user);
    }

    public User getUserById(Integer userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
    }
}
