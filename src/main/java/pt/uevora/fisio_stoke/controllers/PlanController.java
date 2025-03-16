package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import pt.uevora.fisio_stoke.services.impl.PlanService;
import pt.uevora.fisio_stoke.services.impl.UserService;
import pt.uevora.fisio_stoke.dtos.PlanDTO;
import pt.uevora.fisio_stoke.dtos.UserDTO;
import pt.uevora.fisio_stoke.enums.Perfil;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
@Tag(name = "Planos", description = "API para gestão de planos de exercícios")
@SecurityRequirement(name = "bearerAuth")
public class PlanController {
    private final PlanService planService;
    private final UserService userService;

    @PostMapping
    @Operation(summary = "Criar novo plano", description = "Cria um novo plano de exercícios (apenas perfil técnico)")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<PlanDTO> createPlan(@RequestBody PlanDTO planDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Creating new plan");
        System.out.println("Current user: " + auth.getName());
        System.out.println("User authorities: " + auth.getAuthorities());
        System.out.println("Plan data: " + planDTO);
        
        PlanDTO createdPlan = planService.createPlan(planDTO);
        System.out.println("Plan created successfully with ID: " + createdPlan.getId());
        
        return ResponseEntity.ok(createdPlan);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar plano", description = "Atualiza um plano existente (apenas perfil técnico)")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<PlanDTO> updatePlan(@PathVariable Long id, @RequestBody PlanDTO planDTO) {
        return ResponseEntity.ok(planService.updatePlan(id, planDTO));
    }

    @PatchMapping("/{id}/validity-date")
    @Operation(summary = "Atualizar data de validade", description = "Atualiza a data de validade de um plano (apenas perfil técnico)")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<PlanDTO> updateValidityDate(
            @PathVariable Long id,
            @RequestBody LocalDateTime newValidityDate) {
        return ResponseEntity.ok(planService.updateValidityDate(id, newValidityDate));
    }

    @PatchMapping("/{id}/enabled")
    @Operation(summary = "Atualizar estado de ativação", description = "Ativa ou desativa um plano (apenas perfil técnico)")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<PlanDTO> updateEnabled(
            @PathVariable Long id,
            @RequestBody boolean enabled) {
        return ResponseEntity.ok(planService.updateEnabled(id, enabled));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar plano", description = "Elimina um plano existente (apenas perfil técnico)")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter plano", description = "Obtém um plano específico (perfil técnico vê todos, perfil user vê apenas os seus)")
    @PreAuthorize("hasAnyRole('TECHNICAL', 'USER')")
    public ResponseEntity<PlanDTO> getPlan(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Getting plan with id: " + id);
        System.out.println("Current user: " + auth.getName());
        System.out.println("User authorities: " + auth.getAuthorities());
        
        PlanDTO plan = planService.getPlan(id);
        System.out.println("Plan found: " + plan);
        
        return ResponseEntity.ok(plan);
    }

    @GetMapping("/available-users")
    @Operation(summary = "Listar utilizadores disponíveis", description = "Lista todos os utilizadores com perfil 'user' disponíveis para atribuição de planos")
    @PreAuthorize("hasRole('TECHNICAL')")
    public ResponseEntity<List<UserDTO>> getAvailableUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Getting available users");
        System.out.println("Current user: " + auth.getName());
        System.out.println("User authorities: " + auth.getAuthorities());
        
        List<UserDTO> users = userService.getUsersByProfile(Perfil.USER);
        System.out.println("Found " + users.size() + " available users");
        
        return ResponseEntity.ok(users);
    }

    @GetMapping
    @Operation(summary = "Listar planos", description = "Lista todos os planos (perfil técnico vê os que criou, perfil user vê apenas os seus)")
    @PreAuthorize("hasAnyRole('TECHNICAL', 'USER')")
    public ResponseEntity<List<PlanDTO>> getAllPlans(
            @RequestParam(required = false) String userName,
            @RequestParam(required = false) LocalDateTime creationDateStart,
            @RequestParam(required = false) LocalDateTime creationDateEnd,
            @RequestParam(required = false) LocalDateTime validityDateStart,
            @RequestParam(required = false) LocalDateTime validityDateEnd) {
        return ResponseEntity.ok(planService.getAllPlans(userName, creationDateStart, creationDateEnd, validityDateStart, validityDateEnd));
    }
}
