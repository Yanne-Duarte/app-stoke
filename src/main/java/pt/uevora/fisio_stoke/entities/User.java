package pt.uevora.fisio_stoke.entities;


import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pt.uevora.fisio_stoke.enums.Perfil;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Table(name = "users")
@Entity
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Integer id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String birthdate;

    @Column(nullable = false)
    private String password;

    @Column(name = "perfil", nullable = false)
    @Enumerated(EnumType.STRING)
    private Perfil perfil;

    @Column(name = "technical_id")
    private Integer technicalId;

    private String plano;

    @ManyToOne
    @JoinColumn(name = "fisioterapeuta_id")
    private User fisioterapeuta;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    private Boolean status = true;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + perfil.name()));
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public Integer getId() {
        return id;
    }

    public User setId(Integer id) {
        this.id = id;
        return this;
    }

    public String getFullName() {
        return fullName;
    }

    public User setFullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public User setBirthdate(String birthdate) {
        this.birthdate = birthdate;
        return this;
    }

    public User setPassword(String password) {
        this.password = password;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public User setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
        return this;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public User setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
        return this;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public User setPerfil(Perfil perfil) {
        this.perfil = perfil;
        return this;
    }

    public String getPlano() {
        return plano;
    }

    public User setPlano(String plano) {
        this.plano = plano;
        return this;
    }

    public User getFisioterapeuta() {
        return fisioterapeuta;
    }

    public User setFisioterapeuta(User fisioterapeuta) {
        this.fisioterapeuta = fisioterapeuta;
        return this;
    }

    public User setUsername(String username) {
        this.username = username;
        return this;
    }

    public Boolean getStatus() {
        return status;
    }

    public User setStatus(Boolean status) {
        this.status = status;
        return this;
    }

    public Integer getTechnicalId() {
        return technicalId;
    }

    public void setTechnicalId(Integer technicalId) {
        this.technicalId = technicalId;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", username='" + username + '\'' +
                ", birthdate=" + birthdate +
                ", password='" + password + '\'' +
                ", perfil=" + perfil +
                ", plano='" + plano + '\'' +
                ", fisioterapeuta=" + (fisioterapeuta != null ? fisioterapeuta.getId() : "null") +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", status=" + status +
                '}';
    }
}
