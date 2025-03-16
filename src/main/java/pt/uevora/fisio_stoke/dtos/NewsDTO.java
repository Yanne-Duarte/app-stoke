package pt.uevora.fisio_stoke.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsDTO {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String category;
    private String date;
    private boolean status;
} 