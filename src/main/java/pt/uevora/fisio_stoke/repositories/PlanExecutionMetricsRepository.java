package pt.uevora.fisio_stoke.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import pt.uevora.fisio_stoke.entities.PlanExecutionMetrics;

import java.util.List;

@Repository
public interface PlanExecutionMetricsRepository extends JpaRepository<PlanExecutionMetrics, Long> {
    List<PlanExecutionMetrics> findByUserId(Integer userId);
    List<PlanExecutionMetrics> findByUserIdAndPlanId(Integer userId, Long planId);

    @Query("SELECT m FROM PlanExecutionMetrics m WHERE m.user.id = :userId ORDER BY m.startTime DESC")
    List<PlanExecutionMetrics> findLatestByUserId(Integer userId);

    @Query("SELECT m FROM PlanExecutionMetrics m WHERE m.plan.createdBy = :createdBy")
    List<PlanExecutionMetrics> findByPlanCreatedBy(String createdBy);

    @Query("SELECT m FROM PlanExecutionMetrics m WHERE m.user.id = :userId AND m.plan.createdBy = :createdBy")
    List<PlanExecutionMetrics> findByUserIdAndPlanCreatedBy(Integer userId, String createdBy);

    @Query("SELECT COUNT(m) > 0 FROM PlanExecutionMetrics m WHERE m.plan.id = :planId")
    boolean existsByPlanId(Long planId);
} 