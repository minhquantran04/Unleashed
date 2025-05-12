package com.unleashed.rest;

import com.unleashed.dto.CommentUpdateRequestDTO;
import com.unleashed.dto.DashboardReviewDTO;
import com.unleashed.dto.ProductReviewDTO;
import com.unleashed.dto.ReviewDTO;
import com.unleashed.entity.Comment;
import com.unleashed.entity.Review;
import com.unleashed.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewRestController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

//    @GetMapping("/products/{productId}")
//    public ResponseEntity<List<Object []>> getReviewsByProductId(@PathVariable String productId) {
//        List<Object []> reviews = reviewService.getReviewsByProductId(productId);
//        return ResponseEntity.ok(reviews);
//    }

    // Endpoint mới: Lấy TẤT CẢ reviews của sản phẩm (KHÔNG phân trang) - cho trang ALL REVIEWS (ĐÃ CHỈNH SỬA)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReviewDTO>> getAllReviewsByProductId(@PathVariable String productId) {
        List<ProductReviewDTO> reviewList = reviewService.getAllReviewsByProductId(productId);
        return (reviewList == null || reviewList.isEmpty())
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(reviewList);
    }

    @GetMapping("/order-details")
    public ResponseEntity<List<Review>> getReviewsByOrderDetailId(@RequestParam Integer orderDetailId) {
        List<Review> reviews = reviewService.getReviewsByOrderDetailId(orderDetailId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/user/{userName}")
    public ResponseEntity<List<Review>> getReviewsByUserName(@PathVariable String userName) {
        System.out.println(reviewService.getReviewsByUserName(userName).get(0));
        return ResponseEntity.ok(reviewService.getReviewsByUserName(userName));
    }

    @PostMapping
    public ResponseEntity<?> addReview(@Valid @RequestBody ReviewDTO review) {
        try {
            Review createdReview = reviewService.addReview(review);
            return ResponseEntity.ok(createdReview);
        } catch (ResponseStatusException e) {
            // Trả về mã status và message từ exception
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", e.getStatusCode().value());
            errorResponse.put("message", e.getReason());
            return ResponseEntity.status(e.getStatusCode()).body(errorResponse);
        } catch (Exception e) {
            // Trường hợp ngoại lệ khác (ví dụ lỗi hệ thống)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "status", 500,
                    "message", "Error occurred while processing the request."
            ));
        }
    }


    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Integer commentId,
            @RequestParam String username, // Lấy username từ request param hoặc token (tùy theo cách xác thực)
            @Valid @RequestBody CommentUpdateRequestDTO updateRequestDTO) {
        try {
            Comment updatedComment = reviewService.updateComment(commentId, username, updateRequestDTO);
            return ResponseEntity.ok(updatedComment);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of(
                    "status", e.getStatusCode().value(),
                    "error", e.getStatusCode().toString(),
                    "message", e.getReason()  // Lấy message từ exception
            ));
        }
    }


    // **ExceptionHandler cho MethodArgumentNotValidException**
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage())
        );
        return errors;
    }

    @GetMapping("/check-exists")
    public ResponseEntity<Boolean> checkReviewExists(
            @RequestParam String productId,
            @RequestParam String orderId,
            @RequestParam String userId) {
        boolean exists = reviewService.checkReviewExists(productId, orderId, userId);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/get-all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<Page<DashboardReviewDTO>> getDashboardReviews(
            @RequestParam(defaultValue = "0") int page, // Tham số trang, mặc định là trang đầu tiên (0)
            @RequestParam(defaultValue = "50") int size // Tham số kích thước trang, mặc định là 50
    ) {
        if (size > 50) { // Giới hạn kích thước trang tối đa là 50
            size = 50;
        }
        Pageable pageable = PageRequest.of(page, size); // Tạo đối tượng Pageable từ page và size
        Page<DashboardReviewDTO> dashboardReviewsPage = reviewService.getAllDashboardReviews(pageable);
        return ResponseEntity.ok(dashboardReviewsPage);
    }

    @GetMapping("/dashboard/product/{productId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<List<ProductReviewDTO>> getAllReviewsByProductIdDashboard(@PathVariable String productId) {
        List<ProductReviewDTO> reviewList = reviewService.getAllReviewsByProductId(productId);
        return (reviewList == null || reviewList.isEmpty())
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(reviewList);
    }
}