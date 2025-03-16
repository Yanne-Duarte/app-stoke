package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import pt.uevora.fisio_stoke.dtos.LoginUserDto;
import pt.uevora.fisio_stoke.dtos.RegisterUserDto;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.responses.LoginResponse;
import pt.uevora.fisio_stoke.services.impl.AuthenticationService;
import pt.uevora.fisio_stoke.services.impl.JwtService;

@Tag(name = "Autenticação", description = "Endpoints para autenticação e gestão de sessão")
@RequestMapping("/api/auth")
@RestController
public class AuthenticationController {
    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    @Operation(
        summary = "Registrar novo usuário",
        description = "Cria um novo usuário no sistema"
    )
    public ResponseEntity<User> register(@RequestBody RegisterUserDto registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    @Operation(
        summary = "Fazer login",
        description = """
            Autentica o usuário e retorna um token JWT.
            
            Para usar o token retornado:
            1. Copie o valor do token da resposta
            2. Clique no botão 'Authorize' no topo da página
            3. Digite 'Bearer ' seguido do token
            4. Clique em 'Authorize' e depois 'Close'
            5. Agora você pode fazer requisições autenticadas
            """,
        requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
            content = @Content(
                mediaType = MediaType.APPLICATION_JSON_VALUE,
                schema = @Schema(implementation = LoginUserDto.class),
                examples = {
                    @ExampleObject(
                        name = "Admin Login",
                        summary = "Credenciais do administrador",
                        value = """
                        {
                            "username": "joe.due",
                            "password": "qwerty"
                        }
                        """
                    )
                }
            )
        ),
        responses = {
            @ApiResponse(
                responseCode = "200",
                description = "Login realizado com sucesso. Use o token retornado no botão Authorize.",
                content = @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = LoginResponse.class)
                )
            ),
            @ApiResponse(
                responseCode = "401",
                description = "Credenciais inválidas"
            )
        }
    )
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LoginUserDto loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);
        String jwtToken = jwtService.generateToken(authenticatedUser);
        LoginResponse loginResponse = new LoginResponse().setToken(jwtToken).setExpiresIn(jwtService.getExpirationTime());
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    @Operation(
        summary = "Fazer logout",
        description = "Invalida a sessão atual do usuário"
    )
    public ResponseEntity<Void> logout() {
        authenticationService.logout();
        return ResponseEntity.ok().build();
    }
}