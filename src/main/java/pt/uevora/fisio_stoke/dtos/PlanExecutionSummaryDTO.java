package pt.uevora.fisio_stoke.dtos;

import lombok.Data;

@Data
public class PlanExecutionSummaryDTO {
    private Integer userId;
    private String userName;
    private Long planId;
    private String planDescription;
    private Integer totalExecutions;
    private Long averageDuration; // in seconds
    private String lastExecutionDate;
} 