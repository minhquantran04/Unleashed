package com.unleashed.service;

import com.unleashed.dto.NotificationDTO;
import com.unleashed.dto.ResponseDTO;
import com.unleashed.entity.ComposeKey.NotificationUserId;
import com.unleashed.entity.Notification;
import com.unleashed.entity.NotificationUser;
import com.unleashed.entity.User;
import com.unleashed.repo.NotificationRepository;
import com.unleashed.repo.NotificationUserRepository;
import com.unleashed.repo.UserRepository;
import com.unleashed.repo.UserRoleRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    // private final UserRoleRepository userRoleRepository;
    private final UserRepository userRepository;
    private final NotificationUserRepository notificationUserRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRoleRepository userRoleRepository, UserRepository userRepository, NotificationUserRepository notificationUserRepository) {
        this.notificationRepository = notificationRepository;
        // this.userRoleRepository = userRoleRepository;
        this.userRepository = userRepository;
        this.notificationUserRepository = notificationUserRepository;
    }

    public List<Notification> getListNotification() {
        return notificationRepository.findAllByOrderByIdDesc();
    }

    public List<NotificationDTO> getListNotificationDrawer() {
        return notificationRepository.findAllByOrderByIdDesc().stream().map(notification -> {
            NotificationDTO dto = new NotificationDTO();
            dto.setNotificationId(notification.getId());
            dto.setNotificationTitle(notification.getNotificationTitle());
            dto.setNotificationContent(notification.getNotificationContent());

            if (notification.getUserIdSender() != null) {
                dto.setUserName(notification.getUserIdSender().getUsername());
            } else {
                dto.setUserName("Unknown");
            }

            dto.setNotificationDraft(notification.getIsNotificationDraft()); // ✅ Thêm trạng thái draft

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z")
                    .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
            dto.setCreatedAt(notification.getNotificationCreatedAt() != null
                    ? notification.getNotificationCreatedAt().format(formatter)
                    : "No Date");

            return dto;
        }).collect(Collectors.toList());
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    public List<NotificationDTO> getActiveNotificationsForCustomer(String username) {
        // Tìm kiếm người dùng theo username
        User user = userRepository.findByUserUsername(username).orElse(null);
        if (user == null) {
            return Collections.emptyList(); // Nếu không tìm thấy người dùng, trả về danh sách trống
        }

        List<NotificationUser> notificationUsers = notificationUserRepository.findByIdUserId(user.getUserId());
        //  System.out.println("Found notifications for user: " + notificationUsers.size());
        // Lọc và chuyển đổi NotificationUser thành NotificationDTO
        return notificationUsers.stream()
                .map(notificationUser -> {
                    // Tìm kiếm thông báo theo notificationId
                    Notification notification = notificationRepository.findById(notificationUser.getId().getNotificationId()).orElse(null);
                    if (notification == null || notification.getIsNotificationDraft() || notificationUser.getIsNotificationDeleted()) {
                        return null; // Nếu thông báo không hợp lệ, bỏ qua
                    }

                    // Chuyển đổi thông báo thành DTO
                    NotificationDTO dto = new NotificationDTO();
                    dto.setNotificationId(notification.getId());
                    dto.setNotificationTitle(notification.getNotificationTitle());
                    dto.setNotificationContent(notification.getNotificationContent());
                    dto.setUserName(notification.getUserIdSender() != null ? notification.getUserIdSender().getUsername() : "Unknown");
                    dto.setNotificatonViewed(notificationUser.getIsNotificationViewed());

                    // Định dạng ngày gửi
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
                            .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));
                    dto.setCreatedAt(notification.getNotificationCreatedAt() != null
                            ? notification.getNotificationCreatedAt().format(formatter)
                            : "No Date");

                    return dto;
                })
                .filter(Objects::nonNull)  // Loại bỏ giá trị null nếu có
                .collect(Collectors.toList());
    }

    // ✅ Mới: Đánh dấu tất cả là đã xem
    @Transactional
    public ResponseEntity<?> markAllNotificationsAsViewed(String username) {
        User user = userRepository.findByUserUsername(username).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Lấy tất cả NotificationUser của người dùng
        List<NotificationUser> userNotifications = notificationUserRepository.findByIdUserId(user.getUserId());
        System.out.println(userNotifications.get(0).getIsNotificationViewed());
        if (userNotifications.isEmpty()) {
            return ResponseEntity.ok("No notifications to mark as viewed");
        }

        // Đánh dấu tất cả là đã xem
        userNotifications.forEach(notification -> notification.setIsNotificationViewed(true));
        notificationUserRepository.saveAll(userNotifications);

        List<NotificationDTO> updatedNotifications = getActiveNotificationsForCustomer(username);
        return ResponseEntity.ok(updatedNotifications);
    }

    @Transactional
    public ResponseEntity<?> markNotificationAsViewed(Integer notificationId, String username) {
        // Tìm kiếm người dùng
        User user = userRepository.findByUserUsername(username).orElse(null);
        if (user == null) {
            // If user is not found, return 400 Bad Request
            return ResponseEntity.badRequest().body("User not found");
        }

        // Tìm kiếm NotificationUser (mối quan hệ giữa user và notification)
        NotificationUser notificationUser = notificationUserRepository.findById(new NotificationUserId(notificationId, user.getUserId())).orElse(null);
        if (notificationUser == null) {
            // If notificationUser is not found, return 404 Not Found
            return ResponseEntity.status(404).body("Notification not found for this user");
        }

        // Cập nhật trạng thái 'đã xem'
        notificationUser.setIsNotificationViewed(true);
        notificationUserRepository.save(notificationUser);

        // Trả về danh sách thông báo sau khi cập nhật
        List<NotificationDTO> updatedNotifications = getActiveNotificationsForCustomer(username);
        // Only return 200 OK if everything is fine
        return ResponseEntity.ok(updatedNotifications);
    }


    @Transactional
    public ResponseEntity<?> deleteNotificationForCustomer(Integer notificationId, String username) {
        // Tìm kiếm người dùng
        User user = userRepository.findByUserUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.status(400).body("User not found");
        }

        // Tìm kiếm NotificationUser (mối quan hệ giữa user và notification)
        NotificationUser notificationUser = notificationUserRepository.findById(new NotificationUserId(notificationId, user.getUserId())).orElse(null);
        if (notificationUser == null) {
            return ResponseEntity.status(404).body("Notification not found for this user");
        }

        // Đánh dấu thông báo là đã bị xóa
        notificationUser.setIsNotificationDeleted(true);
        notificationUserRepository.save(notificationUser);

        // Trả về phản hồi thành công
        return ResponseEntity.ok("Notification deleted");
    }

    public List<String> getNotificationRecipients(Integer notificationId) {
        // Lấy danh sách NotificationUser liên kết với thông báo
        List<NotificationUser> notificationUsers = notificationUserRepository.findByNotificationId(notificationId);

        // Lọc danh sách người nhận và trả về tên người nhận
        return notificationUsers.stream()
                .map(notificationUser -> {
                    User user = userRepository.findById(notificationUser.getId().getUserId()).orElse(null);
                    return user != null ? user.getUsername() : "Unknown";
                })
                .collect(Collectors.toList());
    }


    public ResponseEntity<?> getNotificationById(Integer id) {
        ResponseDTO responseDTO = new ResponseDTO();
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null) {
            return ResponseEntity.ok(notification);
        }
        responseDTO.setMessage("Notification not found");
        return ResponseEntity.status(404).body(responseDTO);
    }


    @Transactional
    public ResponseEntity<?> addNotification(NotificationDTO notificationDTO) {
        ResponseDTO responseDTO = new ResponseDTO();
        Notification notification = new Notification();

        // Gán các giá trị từ DTO sang Entity
        notification.setNotificationTitle(notificationDTO.getNotificationTitle());
        notification.setNotificationContent(notificationDTO.getNotificationContent());

        // Lấy User từ userSenderId
        User sender = userRepository.findByUserUsername(notificationDTO.getUserName()).orElse(null);
        if (sender == null) {
            return ResponseEntity.status(400).body(Map.of("message", "User sender '" + notificationDTO.getUserName() + "' not found"));
        }
        notification.setUserIdSender(sender);

        // Đặt trạng thái bản nháp nếu có, nếu không thì mặc định false
        notification.setIsNotificationDraft(
                notificationDTO.getNotificationDraft() != null ? notificationDTO.getNotificationDraft() : false
        );

        // Lưu notification trước
        notificationRepository.save(notification);

        // Kiểm tra danh sách người nhận
        List<String> notFoundUsers = new ArrayList<>();
        if (notificationDTO.getUserNames() != null && !notificationDTO.getUserNames().isEmpty()) {
            for (String userName : notificationDTO.getUserNames()) {
                User recipient = userRepository.findByUserUsername(userName).orElse(null);
                if (recipient != null) {
                    NotificationUser notificationUser = new NotificationUser();
                    notificationUser.setId(new NotificationUserId(notification.getId(), recipient.getUserId()));
                    notificationUser.setIsNotificationViewed(false);
                    notificationUser.setIsNotificationDeleted(false);
                    notificationUserRepository.save(notificationUser);
                } else {
                    notFoundUsers.add("Recipient user '" + userName + "' not found");
                }
            }
        }

        // Nếu có user không tìm thấy, trả về lỗi 400
        if (!notFoundUsers.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Some recipients not found", "errors", notFoundUsers));
        }

        return ResponseEntity.status(200).body(Map.of("message", "Successfully added notification"));
    }


    @Transactional
    public ResponseEntity<?> deleteNotification(Integer id) {
        if (id == null || id <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid notification ID"));
        }

        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Notification not found with ID: " + id));
        }

        // Xóa các bản ghi liên quan trong notification_user
        notificationUserRepository.deleteByNotificationId(id);

        // Xóa notification
        notificationRepository.deleteById(id);

        return ResponseEntity.ok(Map.of("message", "Successfully deleted notification and related users"));
    }

//    public List<NotificationDTO> getNotificationsByRoleId(int roleId) {
//        List<Object[]> results = notificationRepository.findByRoleId(roleId);
//        List<NotificationDTO> notificationList = new ArrayList<>();
//
//        for (Object[] result : results) {
//            NotificationDTO notificationDTO = new NotificationDTO();
//            notificationDTO.setNotificationTitle((String) result[0]);
//            notificationDTO.setNotificationContent((String) result[1]);
//            notificationDTO.setCreatedAt((Date) result[2]);
//            notificationList.add(notificationDTO);
//        }
//
//        return notificationList;
//    }

    @Transactional
    public ResponseEntity<?> updateNotification(Notification notification) {
        ResponseDTO responseDTO = new ResponseDTO();
        Notification updatedNotification = notificationRepository.findById(notification.getId()).orElse(null);
        if (updatedNotification != null) {
            updatedNotification.setNotificationTitle(notification.getNotificationTitle());
            updatedNotification.setNotificationContent(notification.getNotificationContent());
//            updatedNotification.setNotificationUsers(notification.getNotificationUsers());
            updatedNotification.setNotificationUpdatedAt(OffsetDateTime.now()); // Cập nhật thời gian sửa đổi
            notificationRepository.save(updatedNotification);
            responseDTO.setMessage("Successfully updated notification");
            return ResponseEntity.ok(responseDTO);
        }
        responseDTO.setMessage("Notification not found");
        return ResponseEntity.status(404).body(responseDTO);
    }
}
