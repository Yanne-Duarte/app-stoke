package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import pt.uevora.fisio_stoke.dtos.RegisterUserDto;
import pt.uevora.fisio_stoke.dtos.UpdateUserByAdminDto;
import pt.uevora.fisio_stoke.dtos.UpdateUserByUserDto;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.services.impl.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Tag(name = "Utilizadores", description = "Endpoints para gestão de utilizadores")
@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User currentUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(currentUser);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICAL')")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        try {
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping
    public List<User> getAllUsers(
        @RequestParam(required = false) String fullName,
        @RequestParam(required = false) String username,
        @RequestParam(required = false) String perfil,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthdate,
        @RequestParam(required = false) String plano,
        @RequestParam(required = false) String fisioterapeuta
    ) {
        return userService.allUsers(fullName, username, perfil, birthdate, plano, fisioterapeuta);
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody RegisterUserDto registerUserDto) {
        User user = userService.registerUser(registerUserDto);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICAL')")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Integer id) {
        try {
            User updatedUser = userService.toggleUserStatus(id);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    }

    @PatchMapping("/{id}/update-user-by-user")
    public ResponseEntity<User> updateUserByUser(
        @PathVariable Integer id,
        @RequestBody UpdateUserByUserDto updateUserDto
    ) {
        try {
            User updatedUser = userService.updateUserByUser(id, updateUserDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PatchMapping("/{id}/update-user-by-admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICAL')")
    public ResponseEntity<User> updateUserByAdmin(
        @PathVariable Integer id,
        @RequestBody UpdateUserByAdminDto updateUserDto
    ) {
        try {
            User updatedUser = userService.updateUserByAdmin(id, updateUserDto);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/getAllTechnical")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllTechnical() {
        List<Map<String, Object>> technicalUsers = userService.getAllTechnicalUsers();
        return ResponseEntity.ok(technicalUsers);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}