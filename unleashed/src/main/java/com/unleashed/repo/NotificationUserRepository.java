package com.unleashed.repo;

import com.unleashed.entity.ComposeKey.NotificationUserId;
import com.unleashed.entity.NotificationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface NotificationUserRepository extends JpaRepository<NotificationUser, NotificationUserId> {
    //    List<NotificationUser> findByUserId(String userId);  // Cập nhật thành String
//    Optional<NotificationUser> findByNotificationIdAndUserId(Integer notificationId, String userId);  // Cập nhật thành String
//    void deleteByNotificationId(Integer notificationId);
    List<NotificationUser> findByIdUserId(String userId);


    @Modifying
    @Transactional
    @Query("UPDATE NotificationUser nu SET nu.isNotificationDeleted = true WHERE nu.id.notificationId IN :notificationIds")
    int markNotificationAsDeleted(@Param("notificationIds") List<Integer> notificationIds);

    @Query("SELECT nu FROM NotificationUser nu WHERE nu.id.notificationId = :notificationId")
    List<NotificationUser> findByNotificationId(@Param("notificationId") Integer notificationId);

    @Modifying
    @Query("DELETE FROM NotificationUser nu WHERE nu.id.notificationId = :notificationId")
    void deleteByNotificationId(@Param("notificationId") Integer notificationId);
}

