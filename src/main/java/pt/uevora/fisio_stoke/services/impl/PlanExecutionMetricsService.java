package pt.uevora.fisio_stoke.services.impl;

import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.dtos.PlanExecutionDetailDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionMetricsDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionSummaryDTO;
import pt.uevora.fisio_stoke.entities.Plan;
import pt.uevora.fisio_stoke.entities.PlanExecutionMetrics;
import pt.uevora.fisio_stoke.repositories.PlanExecutionMetricsRepository;
import pt.uevora.fisio_stoke.repositories.UserRepository;
import pt.uevora.fisio_stoke.repositories.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class PlanExecutionMetricsService {

    @Autowired
    private PlanExecutionMetricsRepository metricsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlanRepository planRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Transactional
    public PlanExecutionMetricsDTO startExecution(Long planId, Integer userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Plan plan = planRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Plan not found"));

        // Verificar se o usuário tem acesso ao plano
        if (!hasAccessToPlan(user, plan)) {
            throw new RuntimeException("User does not have access to this plan");
        }

        PlanExecutionMetrics metrics = new PlanExecutionMetrics();
        metrics.setUser(user);
        metrics.setPlan(plan);
        metrics.setStartTime(LocalDateTime.now());
        metrics.setTotalSteps(plan.getExercises().size());
        metrics.setCurrentStep(0);
        metrics.setCompleted(false);
        metrics.setNextStepClicks(0);
        metrics.setPreviousStepClicks(0);
        metrics.setStepTimings(List.of(0.0)); // Inicializa com tempo 0 para o primeiro passo

        return convertToDTO(metricsRepository.save(metrics));
    }

    @Transactional
    public PlanExecutionMetricsDTO updateExecution(Long executionId, PlanExecutionMetricsDTO updateDTO) {
        PlanExecutionMetrics metrics = metricsRepository.findById(executionId)
            .orElseThrow(() -> new RuntimeException("Execution not found"));

        // Verificar se o usuário atual tem acesso a esta execução
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!hasAccessToExecution(currentUser, metrics)) {
            throw new RuntimeException("User does not have access to this execution");
        }

        if (updateDTO.getCurrentStep() != null) {
            metrics.setCurrentStep(updateDTO.getCurrentStep());
        }
        if (updateDTO.getNextStepClicks() != null) {
            metrics.setNextStepClicks(updateDTO.getNextStepClicks());
        }
        if (updateDTO.getPreviousStepClicks() != null) {
            metrics.setPreviousStepClicks(updateDTO.getPreviousStepClicks());
        }
        if (updateDTO.getTotalSteps() != null) {
            metrics.setTotalSteps(updateDTO.getTotalSteps());
        }
        if (updateDTO.getCompleted() != null) {
            metrics.setCompleted(updateDTO.getCompleted());
            if (updateDTO.getCompleted()) {
                metrics.setEndTime(LocalDateTime.now());
                // Calcular duração total
                Duration duration = Duration.between(metrics.getStartTime(), metrics.getEndTime());
                metrics.setTotalDuration(duration.getSeconds());
            }
        }
        if (updateDTO.getStepTimings() != null) {
            metrics.setStepTimings(updateDTO.getStepTimings());
        }

        return convertToDTO(metricsRepository.save(metrics));
    }

    public List<PlanExecutionSummaryDTO> getExecutionSummary() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PlanExecutionMetrics> allMetrics;

        if (currentUser.getPerfil().name().equals("TECHNICAL")) {
            // Técnico vê métricas dos usuários associados aos seus planos
            allMetrics = metricsRepository.findByPlanCreatedBy(currentUser.getUsername());
        } else {
            // Usuário comum vê apenas suas próprias métricas
            allMetrics = metricsRepository.findByUserId(currentUser.getId());
        }

        return allMetrics.stream()
            .collect(Collectors.groupingBy(
                metrics -> metrics.getUser().getId(),
                Collectors.groupingBy(
                    metrics -> metrics.getPlan().getId(),
                    Collectors.toList()
                )
            ))
            .entrySet().stream()
            .map(userEntry -> {
                PlanExecutionSummaryDTO summary = new PlanExecutionSummaryDTO();
                summary.setUserId(userEntry.getKey());
                summary.setUserName(userEntry.getValue().values().iterator().next().get(0).getUser().getFullName());
                
                userEntry.getValue().forEach((planId, executions) -> {
                    summary.setPlanId(planId);
                    summary.setPlanDescription(executions.get(0).getPlan().getDescription());
                    summary.setTotalExecutions(executions.size());
                    
                    // Calcular média de duração em segundos
                    long totalDuration = executions.stream()
                        .filter(m -> m.getTotalDuration() != null)
                        .mapToLong(PlanExecutionMetrics::getTotalDuration)
                        .sum();
                    long avgDuration = executions.size() > 0 ? totalDuration / executions.size() : 0;
                    summary.setAverageDuration(avgDuration);
                    
                    LocalDateTime lastExecution = executions.stream()
                        .map(PlanExecutionMetrics::getStartTime)
                        .max(LocalDateTime::compareTo)
                        .orElse(null);
                    if (lastExecution != null) {
                        summary.setLastExecutionDate(lastExecution.format(DATE_FORMATTER));
                    }
                });
                
                return summary;
            })
            .collect(Collectors.toList());
    }

    public List<PlanExecutionDetailDTO> getUserExecutions(Integer userId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PlanExecutionMetrics> executions;

        if (currentUser.getPerfil().name().equals("TECHNICAL")) {
            // Técnico vê métricas dos usuários associados aos seus planos
            executions = metricsRepository.findByUserIdAndPlanCreatedBy(userId, currentUser.getUsername());
        } else {
            // Usuário comum vê apenas suas próprias métricas
            if (!currentUser.getId().equals(userId)) {
                throw new RuntimeException("User can only view their own executions");
            }
            executions = metricsRepository.findByUserId(userId);
        }

        return executions.stream()
            .map(this::convertToDetailDTO)
            .collect(Collectors.toList());
    }

    private boolean hasAccessToPlan(User user, Plan plan) {
        if (user.getPerfil().name().equals("TECHNICAL")) {
            return plan.getCreatedBy().equals(user.getUsername());
        } else {
            return plan.getUser().getId().equals(user.getId());
        }
    }

    private boolean hasAccessToExecution(User user, PlanExecutionMetrics execution) {
        if (user.getPerfil().name().equals("TECHNICAL")) {
            return execution.getPlan().getCreatedBy().equals(user.getUsername());
        } else {
            return execution.getUser().getId().equals(user.getId());
        }
    }

    private PlanExecutionMetricsDTO convertToDTO(PlanExecutionMetrics metrics) {
        PlanExecutionMetricsDTO dto = new PlanExecutionMetricsDTO();
        dto.setId(metrics.getId());
        dto.setUserId(metrics.getUser().getId());
        dto.setPlanId(metrics.getPlan().getId());
        dto.setStartTime(metrics.getStartTime().format(DATE_FORMATTER));
        if (metrics.getEndTime() != null) {
            dto.setEndTime(metrics.getEndTime().format(DATE_FORMATTER));
        }
        dto.setTotalDuration(metrics.getTotalDuration());
        dto.setNextStepClicks(metrics.getNextStepClicks());
        dto.setPreviousStepClicks(metrics.getPreviousStepClicks());
        dto.setTotalSteps(metrics.getTotalSteps());
        dto.setCurrentStep(metrics.getCurrentStep());
        dto.setCompleted(metrics.getCompleted());
        dto.setStepTimings(metrics.getStepTimings());
        return dto;
    }

    private PlanExecutionDetailDTO convertToDetailDTO(PlanExecutionMetrics metrics) {
        PlanExecutionDetailDTO dto = new PlanExecutionDetailDTO();
        dto.setId(metrics.getId());
        dto.setUserId(metrics.getUser().getId());
        dto.setPlanId(metrics.getPlan().getId());
        dto.setStartTime(metrics.getStartTime().format(DATE_FORMATTER));
        if (metrics.getEndTime() != null) {
            dto.setEndTime(metrics.getEndTime().format(DATE_FORMATTER));
        }
        dto.setTotalDuration(metrics.getTotalDuration());
        dto.setNextStepClicks(metrics.getNextStepClicks());
        dto.setPreviousStepClicks(metrics.getPreviousStepClicks());
        dto.setTotalSteps(metrics.getTotalSteps());
        dto.setCurrentStep(metrics.getCurrentStep());
        dto.setCompleted(metrics.getCompleted());
        dto.setUserName(metrics.getUser().getFullName());
        dto.setPlanDescription(metrics.getPlan().getDescription());
        
        if (metrics.getStepTimings() != null) {
            List<PlanExecutionDetailDTO.StepTiming> stepTimings = IntStream.range(0, metrics.getStepTimings().size())
                .mapToObj(index -> {
                    PlanExecutionDetailDTO.StepTiming timing = new PlanExecutionDetailDTO.StepTiming();
                    timing.setStepNumber(index);
                    timing.setTimeSpent(metrics.getStepTimings().get(index));
                    return timing;
                })
                .collect(Collectors.toList());
            dto.setExecutionStepTimings(stepTimings);
        }
        
        return dto;
    }
} 