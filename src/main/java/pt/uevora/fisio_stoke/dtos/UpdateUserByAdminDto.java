package pt.uevora.fisio_stoke.dtos;


import pt.uevora.fisio_stoke.enums.Perfil;

public class UpdateUserByAdminDto extends UpdateUserByUserDto {
    private String password;
    private Perfil perfil;
    
    // getters e setters
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
} 