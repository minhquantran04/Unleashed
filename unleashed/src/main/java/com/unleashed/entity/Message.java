package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "message", schema = "public")
public class Message {
    @Id
    @ColumnDefault("nextval('message_message_id_seq')")
    @Column(name = "message_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id")
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private com.unleashed.entity.User sender;

    @Column(name = "message_text", length = Integer.MAX_VALUE)
    private String messageText;

    @Column(name = "message_send_at")
    private OffsetDateTime messageSendAt;

    @Column(name = "message_image_url")
    private String messageImageUrl;

    @Column(name = "is_message_edited")
    private Boolean isMessageEdited;

    @Column(name = "is_message_deleted")
    private Boolean isMessageDeleted;

    @PrePersist
    protected void onCreate() {
        setMessageSendAt(OffsetDateTime.now());
    }

}