package pt.uevora.fisio_stoke.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDTO {
    private String description;
    private String videoPath;
} 