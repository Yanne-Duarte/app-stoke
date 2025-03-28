package pt.uevora.fisio_stoke.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "plan_execution_metrics")
public class PlanExecutionMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private Plan plan;

    @Column(nullable = false)
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Column(name = "total_duration")
    private Long totalDuration; // in seconds

    @Column(nullable = false)
    private Integer nextStepClicks = 0;

    @Column(nullable = false)
    private Integer previousStepClicks = 0;

    @Column(nullable = false)
    private Integer totalSteps = 0;

    @Column(nullable = false)
    private Integer currentStep = 0;

    @Column(nullable = false)
    private Boolean completed = false;

    @ElementCollection
    @CollectionTable(name = "plan_execution_step_timings", joinColumns = @JoinColumn(name = "execution_id"))
    @Column(name = "time_spent")
    private List<Double> stepTimings;
} 