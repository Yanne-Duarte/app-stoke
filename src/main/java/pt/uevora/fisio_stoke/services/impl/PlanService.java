package pt.uevora.fisio_stoke.services.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import pt.uevora.fisio_stoke.dtos.ExerciseDTO;
import pt.uevora.fisio_stoke.dtos.PlanDTO;
import pt.uevora.fisio_stoke.dtos.UserDTO;
import pt.uevora.fisio_stoke.entities.Exercise;
import pt.uevora.fisio_stoke.entities.Plan;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.PlanRepository;
import pt.uevora.fisio_stoke.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanService {
    private final PlanRepository planRepository;
    private final UserRepository userRepository;

    public List<PlanDTO> getAllPlans(
            String userName,
            LocalDateTime creationDateStart,
            LocalDateTime creationDateEnd,
            LocalDateTime validityDateStart,
            LocalDateTime validityDateEnd) {
        
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isTechnical = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICAL"));

        List<Plan> plans;
        if (isTechnical) {
            // Se for técnico, busca pelos planos que ele criou
            plans = planRepository.findByCreatedBy(currentUsername);
        } else {
            // Se for usuário comum, busca pelos planos associados a ele
            User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            plans = planRepository.findByUser(currentUser);
        }
        
        return plans.stream()
                .filter(plan -> userName == null || 
                       (plan.getUser() != null && 
                        plan.getUser().getFullName().toLowerCase().contains(userName.toLowerCase())))
                .filter(plan -> creationDateStart == null || !plan.getCreationDate().isBefore(creationDateStart))
                .filter(plan -> creationDateEnd == null || !plan.getCreationDate().isAfter(creationDateEnd))
                .filter(plan -> validityDateStart == null || !plan.getValidityDate().isBefore(validityDateStart))
                .filter(plan -> validityDateEnd == null || !plan.getValidityDate().isAfter(validityDateEnd))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PlanDTO createPlan(PlanDTO planDTO) {
        validateTechnicalProfile();
        Plan plan = convertToEntity(planDTO);
        
        // Forçar datas no backend para novos planos
        plan.setCreationDate(LocalDateTime.now());
        plan.setValidityDate(LocalDateTime.now().plusDays(30));
        plan.setEnabled(true);
        plan.setCreatedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        
        return convertToDTO(planRepository.save(plan));
    }

    public PlanDTO updatePlan(Long id, PlanDTO planDTO) {
        validateTechnicalProfile();
        Plan existingPlan = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));
        
        validatePlanAccess(existingPlan);
        updatePlanFields(existingPlan, planDTO);
        return convertToDTO(planRepository.save(existingPlan));
    }

    public void deletePlan(Long id) {
        validateTechnicalProfile();
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));
        validatePlanAccess(plan);
        planRepository.deleteById(id);
    }

    public PlanDTO getPlan(Long id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));
        
        validatePlanAccess(plan);
        return convertToDTO(plan);
    }

    public PlanDTO updateValidityDate(Long id, LocalDateTime newValidityDate) {
        validateTechnicalProfile();
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));
        
        validatePlanAccess(plan);
        plan.setValidityDate(newValidityDate);
        return convertToDTO(planRepository.save(plan));
    }

    public PlanDTO updateEnabled(Long id, boolean enabled) {
        validateTechnicalProfile();
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Plano não encontrado"));
        
        validatePlanAccess(plan);
        plan.setEnabled(enabled);
        return convertToDTO(planRepository.save(plan));
    }

    private void validateTechnicalProfile() {
        if (!SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream().anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICAL"))) {
            throw new SecurityException("Apenas perfis técnicos podem realizar esta operação");
        }
    }

    private void validatePlanAccess(Plan plan) {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        boolean isTechnical = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TECHNICAL"));

        if (isTechnical && !plan.getCreatedBy().equals(currentUser)) {
            throw new SecurityException("Não autorizado a acessar este plano");
        } else if (!isTechnical && !plan.getUser().getUsername().equals(currentUser)) {
            throw new SecurityException("Não autorizado a acessar este plano");
        }
    }

    private Plan convertToEntity(PlanDTO dto) {
        Plan plan = new Plan();
        plan.setId(dto.getId());
        
        // Buscar o usuário pelo ID do DTO
        if (dto.getUser() != null && dto.getUser().getId() != null) {
            User user = userRepository.findById(dto.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            plan.setUser(user);
        }
        
        plan.setDescription(dto.getDescription());
        
        // Apenas converter datas se não for uma criação (update)
        if (dto.getId() != null) {
            plan.setCreationDate(dto.getCreationDate() != null ? LocalDateTime.parse(dto.getCreationDate()) : LocalDateTime.now());
            plan.setValidityDate(dto.getValidityDate() != null ? LocalDateTime.parse(dto.getValidityDate()) : LocalDateTime.now().plusDays(30));
            plan.setEnabled(dto.isEnabled());
            plan.setCreatedBy(dto.getCreatedBy());
        }
        
        if (dto.getExercises() != null) {
            List<Exercise> exercises = dto.getExercises().stream()
                    .map(exerciseDTO -> new Exercise(
                            exerciseDTO.getDescription(),
                            exerciseDTO.getVideoPath()))
                    .collect(Collectors.toList());
            plan.setExercises(exercises);
        }
        
        return plan;
    }

    private PlanDTO convertToDTO(Plan entity) {
        PlanDTO dto = new PlanDTO();
        dto.setId(entity.getId());
        
        // Converter User para UserDTO
        if (entity.getUser() != null) {
            UserDTO userDTO = new UserDTO(
                entity.getUser().getId(),
                entity.getUser().getFullName(),
                entity.getUser().getUsername(),
                entity.getUser().getBirthdate(),
                null, // não enviar senha
                null, // não enviar token
                entity.getUser().getPerfil().toString(),
                entity.getUser().getPlano(),
                entity.getUser().getFisioterapeuta() != null ? entity.getUser().getFisioterapeuta().getId() : null,
                entity.getUser().getFisioterapeuta() != null ? entity.getUser().getFisioterapeuta().getFullName() : null
            );
            dto.setUser(userDTO);
        }
        
        dto.setDescription(entity.getDescription());
        dto.setCreationDate(entity.getCreationDate().toString());
        dto.setValidityDate(entity.getValidityDate().toString());
        dto.setEnabled(entity.isEnabled());
        dto.setCreatedBy(entity.getCreatedBy());
        
        if (entity.getExercises() != null) {
            List<ExerciseDTO> exerciseDTOs = entity.getExercises().stream()
                    .map(exercise -> new ExerciseDTO(
                            exercise.getDescription(),
                            exercise.getVideoPath()))
                    .collect(Collectors.toList());
            dto.setExercises(exerciseDTOs);
        }
        
        return dto;
    }

    private void updatePlanFields(Plan existingPlan, PlanDTO planDTO) {
        if (planDTO.getUser() != null && planDTO.getUser().getId() != null) {
            User user = userRepository.findById(planDTO.getUser().getId())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
            existingPlan.setUser(user);
        }
        
        existingPlan.setDescription(planDTO.getDescription());
        
        if (planDTO.getExercises() != null) {
            List<Exercise> exercises = planDTO.getExercises().stream()
                    .map(exerciseDTO -> new Exercise(
                            exerciseDTO.getDescription(),
                            exerciseDTO.getVideoPath()))
                    .collect(Collectors.toList());
            existingPlan.setExercises(exercises);
        }
    }
}
