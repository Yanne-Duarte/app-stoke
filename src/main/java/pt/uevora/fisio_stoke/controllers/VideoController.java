package pt.uevora.fisio_stoke.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pt.uevora.fisio_stoke.entities.Video;
import pt.uevora.fisio_stoke.services.impl.VideoService;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @GetMapping
    public ResponseEntity<List<Video>> getAllVideos() {
        return ResponseEntity.ok(videoService.getAllVideos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        return videoService.getVideoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Video> saveVideo(@RequestBody Video video) {
        return ResponseEntity.ok(videoService.saveVideo(video));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        videoService.deleteVideo(id);
        return ResponseEntity.ok().build();
    }
}
