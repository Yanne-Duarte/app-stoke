package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.uevora.fisio_stoke.entities.Plan;
import pt.uevora.fisio_stoke.entities.User;
import java.util.List;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByUser(User user);
    List<Plan> findByUserAndEnabled(User user, boolean enabled);
    List<Plan> findByCreatedBy(String createdBy);
    List<Plan> findByUserIdAndEnabled(Integer userId, boolean enabled);
}
