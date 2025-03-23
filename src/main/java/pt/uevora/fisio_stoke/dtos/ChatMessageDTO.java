package pt.uevora.fisio_stoke.dtos;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ChatMessageDTO {
    private String sender;
    private String recipient;
    private String content;
    private String timestamp;
    private String mensagem;
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public ChatMessageDTO() {
        this.timestamp = LocalDateTime.now().format(formatter);
    }

    public ChatMessageDTO(String sender, String content) {
        this();
        this.sender = sender;
        this.content = content;
        this.mensagem = content; // Para compatibilidade com o frontend existente
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        if (sender == null || sender.trim().isEmpty()) {
            throw new IllegalArgumentException("Sender cannot be null or empty");
        }
        this.sender = sender.trim();
    }

    public String getRecipient() {
        return recipient;
    }

    public void setRecipient(String recipient) {
        if (recipient == null || recipient.trim().isEmpty()) {
            throw new IllegalArgumentException("Recipient cannot be null or empty");
        }
        this.recipient = recipient.trim();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be null or empty");
        }
        this.content = content.trim();
        this.mensagem = content.trim(); // Para compatibilidade com o frontend existente
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        if (mensagem == null || mensagem.trim().isEmpty()) {
            throw new IllegalArgumentException("Mensagem cannot be null or empty");
        }
        this.mensagem = mensagem.trim();
        this.content = mensagem.trim(); // Para compatibilidade com o frontend existente
    }

    @Override
    public String toString() {
        return String.format("ChatMessageDTO{sender='%s', recipient='%s', content='%s', timestamp='%s'}", 
            sender, recipient, content, timestamp);
    }
} 