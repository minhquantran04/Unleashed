package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "notification", schema = "public")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('notification_notification_id_seq')")
    @Column(name = "notification_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id_sender")
    private com.unleashed.entity.User userIdSender;

    @Column(name = "notification_title", length = Integer.MAX_VALUE)
    private String notificationTitle;

    @Column(name = "notification_content", length = Integer.MAX_VALUE)
    private String notificationContent;

    @Column(name = "is_notification_draft")
    private Boolean isNotificationDraft;

    @Column(name = "notification_created_at")
    private OffsetDateTime notificationCreatedAt;

    @Column(name = "notification_updated_at")
    private OffsetDateTime notificationUpdatedAt;

    @PrePersist
    protected void onCreate() {
        setNotificationCreatedAt(OffsetDateTime.now());
        setNotificationUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    protected void onUpdate() {
        setNotificationUpdatedAt(OffsetDateTime.now());
    }

}