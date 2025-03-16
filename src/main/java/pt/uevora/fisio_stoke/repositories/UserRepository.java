package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.enums.Perfil;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    List<User> findByPerfil(Perfil perfil);
    List<User> findByTechnicalId(Integer technicalId);
}
