package com.unleashed.repo;

import com.unleashed.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    /**
     * Lấy tất cả Notification, sắp xếp giảm dần theo notificationId.
     * Dựa trên convention: findAllByOrderBy<TênTrường>Desc()
     */
    List<Notification> findAllByOrderByIdDesc();

    /**
     * Ví dụ: Lọc các Notification theo user_id_sender
     * (nếu muốn tìm tất cả thông báo mà user_id_sender = userId nào đó).
     * Dùng native query vì cột user_id_sender là varchar,
     * và bạn muốn truy vấn trực tiếp.
     */
    @Query(value =
            "SELECT * FROM notification n " +
                    "WHERE n.user_id_sender = :userId " +
                    "ORDER BY n.notification_id DESC",
            nativeQuery = true)
    List<Notification> findAllByUserIdSender(@Param("userId") String userId);
}
