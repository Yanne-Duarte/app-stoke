package pt.uevora.fisio_stoke.entities;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "videos")
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private Double size;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private Boolean storedLocally = false;

    @Column
    private String downloadFolder;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
} 