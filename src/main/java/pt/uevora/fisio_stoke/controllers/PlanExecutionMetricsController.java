package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import pt.uevora.fisio_stoke.dtos.PlanExecutionDetailDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionMetricsDTO;
import pt.uevora.fisio_stoke.dtos.PlanExecutionSummaryDTO;
import pt.uevora.fisio_stoke.services.impl.PlanExecutionMetricsService;

import java.util.List;

@RestController
@RequestMapping("/api/plan-executions")
@Tag(name = "Métricas de Execução", description = "API para gestão de métricas de execução de planos")
@SecurityRequirement(name = "bearerAuth")
public class PlanExecutionMetricsController {

    private final PlanExecutionMetricsService metricsService;

    public PlanExecutionMetricsController(PlanExecutionMetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @PostMapping("/start/{planId}")
    @Operation(summary = "Iniciar execução", description = "Inicia uma nova execução de um plano")
    public ResponseEntity<PlanExecutionMetricsDTO> startExecution(@PathVariable Long planId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Integer userId = ((pt.uevora.fisio_stoke.entities.User) auth.getPrincipal()).getId();
        
        return ResponseEntity.ok(metricsService.startExecution(planId, userId));
    }

    @PutMapping("/{executionId}")
    @Operation(summary = "Atualizar execução", description = "Atualiza os dados de uma execução em andamento")
    public ResponseEntity<PlanExecutionMetricsDTO> updateExecution(
            @PathVariable Long executionId,
            @RequestBody PlanExecutionMetricsDTO updateDTO) {
        return ResponseEntity.ok(metricsService.updateExecution(executionId, updateDTO));
    }

    @GetMapping("/summary")
    @Operation(summary = "Resumo de execuções", description = "Obtém um resumo das execuções de planos")
    public ResponseEntity<List<PlanExecutionSummaryDTO>> getExecutionSummary() {
        return ResponseEntity.ok(metricsService.getExecutionSummary());
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Execuções do usuário", description = "Obtém as execuções detalhadas de um usuário")
    public ResponseEntity<List<PlanExecutionDetailDTO>> getUserExecutions(@PathVariable Integer userId) {
        return ResponseEntity.ok(metricsService.getUserExecutions(userId));
    }

    @GetMapping("/{executionId}")
    @Operation(summary = "Detalhes da execução", description = "Obtém os detalhes de uma execução específica")
    public ResponseEntity<PlanExecutionDetailDTO> getExecutionDetails(@PathVariable Long executionId) {
        return ResponseEntity.ok(metricsService.getExecutionDetails(executionId));
    }
}
 