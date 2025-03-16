package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDTO {
    private Integer id;
    private String fullName;
    private String username;
    private String birthdate;
    private String password;
    private String token;
    private String perfil;
    private String plano;
    private Integer fisioterapeutaId;
    private String fisioterapeutaName;

    public UserDTO(
        Integer id,
        String fullName,
        String username,
        String birthdate,
        String password,
        String token,
        String perfil,
        String plano,
        Integer fisioterapeutaId,
        String fisioterapeutaName
    ) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.birthdate = birthdate;
        this.password = password;
        this.token = token;
        this.perfil = perfil;
        this.plano = plano;
        this.fisioterapeutaId = fisioterapeutaId;
        this.fisioterapeutaName = fisioterapeutaName;
    }
} 