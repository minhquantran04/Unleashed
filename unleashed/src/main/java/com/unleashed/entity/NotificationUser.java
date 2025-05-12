package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.NotificationUserId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "notification_user", schema = "public")
public class NotificationUser {
    @SequenceGenerator(name = "notification_user_id_gen", sequenceName = "category_category_id_seq", allocationSize = 1)
    @EmbeddedId
    private NotificationUserId id;

    @Column(name = "is_notification_viewed")
    private Boolean isNotificationViewed;

    @Column(name = "is_notification_deleted")
    private Boolean isNotificationDeleted;

}