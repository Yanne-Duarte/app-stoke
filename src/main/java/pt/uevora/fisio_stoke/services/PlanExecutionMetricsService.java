package pt.uevora.fisio_stoke.services;

import pt.uevora.fisio_stoke.dtos.PlanExecutionMetricsDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionSummaryDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionDetailDTO;

import java.util.List;

public interface PlanExecutionMetricsService {
    PlanExecutionMetricsDTO startExecution(Long planId, Integer userId);
    PlanExecutionMetricsDTO updateExecution(Long executionId, PlanExecutionMetricsDTO updateDTO);
    List<PlanExecutionSummaryDTO> getExecutionSummary();
    List<PlanExecutionDetailDTO> getUserExecutions(Integer userId);
    PlanExecutionDetailDTO getExecutionDetails(Long executionId);
    PlanExecutionMetricsDTO getMetricsByUser(Integer userId);
    PlanExecutionMetricsDTO getMetricsByPlan(Long planId);
    PlanExecutionMetricsDTO getExecutionById(Long id);
    PlanExecutionMetricsDTO getExecutionByPlanAndUser(Long planId, Integer userId);
} 