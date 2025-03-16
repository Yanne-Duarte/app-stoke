package pt.uevora.fisio_stoke.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import pt.uevora.fisio_stoke.entities.Video;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.VideoRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    public List<Video> getAllVideos() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return videoRepository.findAllByUserId(currentUser.getId());
    }

    public Optional<Video> getVideoById(Long id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return videoRepository.findByIdAndUserId(id, currentUser.getId());
    }

    public Video saveVideo(Video video) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        video.setUserId(currentUser.getId());
        return videoRepository.save(video);
    }

    @Transactional
    public void deleteVideo(Long id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        videoRepository.deleteByIdAndUserId(id, currentUser.getId());
    }
}
