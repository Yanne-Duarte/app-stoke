package pt.uevora.fisio_stoke.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanDTO {
    private Long id;
    private UserDTO user;
    private String createdBy;
    private String description;
    private String creationDate;
    private String validityDate;
    private boolean enabled;
    private List<ExerciseDTO> exercises;
}
