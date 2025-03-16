package pt.uevora.fisio_stoke.services.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.uevora.fisio_stoke.entities.Notice;
import pt.uevora.fisio_stoke.entities.User;
import pt.uevora.fisio_stoke.repositories.NoticeRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NoticeService {
    private final NoticeRepository noticeRepository;

    public Notice createNotice(String title, String body, User creator) {
        Notice notice = new Notice();
        notice.setTitle(title);
        notice.setBody(body);
        notice.setCreator(creator);
        return noticeRepository.save(notice);
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAll();
    }

    public Notice getNotice(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Notice not found"));
    }

    public Notice updateNotice(Long id, String title, String body) {
        Notice notice = getNotice(id);
        notice.setTitle(title);
        notice.setBody(body);
        return noticeRepository.save(notice);
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }
} 