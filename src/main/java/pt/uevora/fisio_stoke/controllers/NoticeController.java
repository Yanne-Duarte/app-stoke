package pt.uevora.fisio_stoke.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pt.uevora.fisio_stoke.dtos.NoticeCreateDTO;
import pt.uevora.fisio_stoke.dtos.NoticeResponseDTO;
import pt.uevora.fisio_stoke.entities.Notice;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.services.impl.NoticeService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
@Tag(name = "Notices", description = "Endpoints for managing notices")
public class NoticeController {
    private final NoticeService noticeService;

    @PostMapping
    @PreAuthorize("hasRole('TECHNICAL')")
    @Operation(summary = "Create new notice", description = "Creates a new notice entry")
    public ResponseEntity<NoticeResponseDTO> createNotice(
            @AuthenticationPrincipal User creator,
            @Valid @RequestBody NoticeCreateDTO dto) {
        Notice notice = noticeService.createNotice(
                dto.getTitle(),
                dto.getBody(),
                creator
        );
        return ResponseEntity.ok(NoticeResponseDTO.fromEntity(notice));
    }

    @GetMapping
    @Operation(summary = "List all notices")
    public ResponseEntity<List<NoticeResponseDTO>> getAllNotices() {
        List<NoticeResponseDTO> notices = noticeService.getAllNotices()
                .stream()
                .map(NoticeResponseDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a specific notice")
    public ResponseEntity<NoticeResponseDTO> getNotice(@PathVariable Long id) {
        return ResponseEntity.ok(NoticeResponseDTO.fromEntity(noticeService.getNotice(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TECHNICAL')")
    @Operation(summary = "Update notice", description = "Updates an existing notice entry")
    public ResponseEntity<NoticeResponseDTO> updateNotice(
            @PathVariable Long id,
            @Valid @RequestBody NoticeCreateDTO dto) {
        Notice notice = noticeService.updateNotice(
                id,
                dto.getTitle(),
                dto.getBody()
        );
        return ResponseEntity.ok(NoticeResponseDTO.fromEntity(notice));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete notice", description = "Deletes an existing notice entry")
    public ResponseEntity<Void> deleteNotice(@PathVariable Long id) {
        noticeService.deleteNotice(id);
        return ResponseEntity.ok().build();
    }
} 