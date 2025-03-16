package pt.uevora.fisio_stoke.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;

@Table(name = "messages")
@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @Column(name = "read_at")
    private Date readAt;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Message setId(Long id) {
        this.id = id;
        return this;
    }

    public String getContent() {
        return content;
    }

    public Message setContent(String content) {
        this.content = content;
        return this;
    }

    public User getSender() {
        return sender;
    }

    public Message setSender(User sender) {
        this.sender = sender;
        return this;
    }

    public User getRecipient() {
        return recipient;
    }

    public Message setRecipient(User recipient) {
        this.recipient = recipient;
        return this;
    }

    public Date getReadAt() {
        return readAt;
    }

    public Message setReadAt(Date readAt) {
        this.readAt = readAt;
        return this;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }
} 