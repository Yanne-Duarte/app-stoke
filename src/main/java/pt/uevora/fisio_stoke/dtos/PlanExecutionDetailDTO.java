package pt.uevora.fisio_stoke.dtos;

import lombok.Data;
import java.util.List;

@Data
public class PlanExecutionDetailDTO extends PlanExecutionMetricsDTO {
    private String userName;
    private String planDescription;
    private List<StepTiming> executionStepTimings;

    @Data
    public static class StepTiming {
        private Integer stepNumber;
        private Double timeSpent; // in seconds
    }
} 