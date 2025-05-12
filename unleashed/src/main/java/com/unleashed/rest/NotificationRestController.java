package com.unleashed.rest;

import com.unleashed.dto.NotificationDTO;
import com.unleashed.entity.Notification;
import com.unleashed.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationRestController {

    private final NotificationService notificationService;

    public NotificationRestController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping("/{id}/recipients")
    public ResponseEntity<?> getNotificationRecipients(@PathVariable Integer id) {
        List<String> recipients = notificationService.getNotificationRecipients(id);
        return ResponseEntity.ok(recipients);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping("/as")
    public ResponseEntity<List<NotificationDTO>> getNotifications() {
        List<Notification> notifications = notificationService.getListNotification();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss Z")
                .withZone(ZoneId.of("Asia/Ho_Chi_Minh"));  // Chuyển về múi giờ VN (+07)

        List<NotificationDTO> notificationDTOs = notifications.stream().map(notification -> {
            NotificationDTO dto = new NotificationDTO();

            dto.setNotificationId(notification.getId());

            dto.setNotificationTitle(notification.getNotificationTitle());
            dto.setNotificationContent(notification.getNotificationContent());


            if (notification.getUserIdSender() != null) {
                dto.setUserName(notification.getUserIdSender().getUsername());
            } else {
                dto.setUserName("Unknown");  // Nếu không có thông tin người gửi
            }

            dto.setCreatedAt(notification.getNotificationCreatedAt() != null
                    ? notification.getNotificationCreatedAt().format(formatter)
                    : "No Date");

            dto.setUpdatedAt(notification.getNotificationUpdatedAt() != null
                    ? notification.getNotificationUpdatedAt().format(formatter)
                    : "No Date");

            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(notificationDTOs);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/customer/{username}")
    public ResponseEntity<List<NotificationDTO>> getActiveNotificationsForCustomer(@PathVariable String username) {
        //System.out.println("Fetching active notifications for: " + username);
        return ResponseEntity.ok(notificationService.getActiveNotificationsForCustomer(username));
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PutMapping("/customer/view/{notificationId}")
    public ResponseEntity<?> markNotificationAsViewed(@PathVariable String notificationId, @RequestParam String username) {
        ResponseEntity<?> response;

        if ("all".equals(notificationId)) {
            // Đánh dấu tất cả nếu notificationId = "all"
            response = notificationService.markAllNotificationsAsViewed(username);
        } else {
            // Đánh dấu một thông báo cụ thể
            response = notificationService.markNotificationAsViewed(Integer.parseInt(notificationId), username);
        }

        return response;
    }


    @PreAuthorize("hasAuthority('CUSTOMER')")
    @PutMapping("/customer/delete/{notificationId}")
    public ResponseEntity<?> deleteNotificationForCustomer(
            @PathVariable Integer notificationId,
            @RequestParam String username) {

        ResponseEntity<?> response = notificationService.deleteNotificationForCustomer(notificationId, username);
        return response; // Trả về response chính xác từ service
    }

//    @PreAuthorize("hasAnyAuthority('CUSTOMER')")
//    @GetMapping
//    @JsonView(Views.ListView.class)
//    public ResponseEntity<List<NotificationDTO>> getNotificationsbyUser() {
//        return ResponseEntity.ok(notificationService.getNotificationsByRoleId(2));
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable Integer id) {
        return notificationService.getNotificationById(id);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody NotificationDTO notification) {
        return notificationService.addNotification(notification);
    }

//    @PreAuthorize("hasAuthority('STAFF')")
//    @PostMapping("/staff")
//    public ResponseEntity<?> createNotificationStaff(@RequestBody NotificationDTO notification) {

    /// /        notification.setTargetRoleId(2);
//        return notificationService.addNotification(notification);
//    }

//    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
//    @PutMapping
//    public ResponseEntity<?> updateNotification(@RequestBody Notification notification) {
//        return notificationService.updateNotification(notification);
//    }
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Integer notificationId) {
        if (notificationId == null || notificationId <= 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Invalid notification ID"));
        }
        // TRẢ VỀ TRỰC TIẾP RESPONSE TỪ SERVICE
        return notificationService.deleteNotification(notificationId);
    }


}
