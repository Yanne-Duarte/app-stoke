package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import pt.uevora.fisio_stoke.enums.Perfil;

@Data
public class RegisterUserDto {
    private String fullName;
    private String username;
    private String password;
    private String birthdate;
    private Perfil perfil;
    private String plano;
    private Integer fisioterapeutaId;

    public String getFullName() {
        return fullName;
    }

    public RegisterUserDto setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public String getUsername() {
        return username;
    }

    public RegisterUserDto setUsername(String username) {
        this.username = username;
        return this;
    }

    public String getPassword() {
        return password;
    }

    public RegisterUserDto setPassword(String password) {
        this.password = password;
        return this;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public RegisterUserDto setBirthdate(String birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public RegisterUserDto setPerfil(Perfil perfil) {
        this.perfil = perfil;
        return this;
    }

    public String getPlano() {
        return plano;
    }

    public RegisterUserDto setPlano(String plano) {
        this.plano = plano;
        return this;
    }

    public Integer getFisioterapeutaId() {
        return fisioterapeutaId;
    }

    public RegisterUserDto setFisioterapeutaId(Integer fisioterapeutaId) {
        this.fisioterapeutaId = fisioterapeutaId;
        return this;
    }

    @Override
    public String toString() {
        return "RegisterUserDto{" +
                "fullName='" + fullName + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", birthdate=" + birthdate +
                ", perfil=" + perfil +
                ", plano='" + plano + '\'' +
                ", fisioterapeutaId=" + fisioterapeutaId +
                '}';
    }
}