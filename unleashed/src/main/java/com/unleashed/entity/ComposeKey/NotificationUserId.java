package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class NotificationUserId implements java.io.Serializable {
    private static final long serialVersionUID = 5482598538523939684L;
    @Column(name = "notification_id")
    private Integer notificationId;

    @Column(name = "user_id", length = Integer.MAX_VALUE)
    private String userId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        NotificationUserId entity = (NotificationUserId) o;
        return Objects.equals(this.notificationId, entity.notificationId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(notificationId, userId);
    }

}