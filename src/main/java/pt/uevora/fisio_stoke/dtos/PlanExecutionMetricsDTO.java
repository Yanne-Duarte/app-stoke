package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import java.util.List;

@Data
public class PlanExecutionMetricsDTO {
    private Long id;
    private Integer userId;
    private Long planId;
    private String startTime;
    private String endTime;
    private Long totalDuration; // in seconds
    private Integer nextStepClicks;
    private Integer previousStepClicks;
    private Integer totalSteps;
    private Integer currentStep;
    private Boolean completed;
    private List<Double> stepTimings;
} 