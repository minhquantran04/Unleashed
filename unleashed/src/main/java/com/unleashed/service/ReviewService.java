package com.unleashed.service;

import com.unleashed.dto.CommentUpdateRequestDTO;
import com.unleashed.dto.DashboardReviewDTO;
import com.unleashed.dto.ProductReviewDTO;
import com.unleashed.dto.ReviewDTO;
import com.unleashed.entity.*;
import com.unleashed.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final OrderVariationSingleRepository orderVariationSingleRepository;
    private final VariationSingleRepository variationSingleRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository, OrderVariationSingleRepository orderVariationSingleRepository, VariationSingleRepository variationSingleRepository, CommentRepository commentRepository, UserRepository userRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.orderVariationSingleRepository = orderVariationSingleRepository;
        this.variationSingleRepository = variationSingleRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Object[]> getReviewsByProductId(String productId) {
        return reviewRepository.findReviewByProductId(productId);
    }

    public List<ProductReviewDTO> getAllReviewsByProductId(String productId) {
        List<ProductReviewDTO> productReviewDTOList = new ArrayList<>();

        // 1 Lấy tất cả review theo productId
        List<Review> allReviews = reviewRepository.findAllReviewsByProductId(productId);
        if (allReviews.isEmpty()) return productReviewDTOList; // Trả về danh sách rỗng nếu không có review nào

        // 2 Lấy danh sách reviewId để tìm comment
        List<Integer> reviewIds = allReviews.stream().map(Review::getId).collect(Collectors.toList());

        // 3 Lấy tất cả comments liên quan đến reviewIds
        List<Comment> allCommentsForReviews = reviewRepository.findAllCommentsByReviewIds(reviewIds);
        List<Integer> commentIds = allCommentsForReviews.stream().map(Comment::getId).toList();

        // 4 Lấy comment gốc từ danh sách comment
        List<Comment> rootComments = reviewRepository.findRootCommentsByCommentIds(commentIds);

        List<Review> rootReviews = new ArrayList<>();
        for (Review review : allReviews) {
            if (review.getReviewRating() != null) {
                rootReviews.add(review);
            }
        }

        // 5 Duyệt qua từng review và ánh xạ dữ liệu vào DTO
        for (Review review : rootReviews) {
            ProductReviewDTO dto = new ProductReviewDTO();
            dto.setReviewId(review.getId());
            dto.setFullName(review.getUser().getUsername()); // Lấy username từ review
            dto.setReviewRating(review.getReviewRating());
            dto.setUserImage(review.getUser().getUserImage()); // Lấy userImage từ review



            // 6 Tìm comment gốc của review này
            for (Comment rootComment : rootComments) {
                if (rootComment.getReview().getId().equals(review.getId())) {
                    dto.setReviewComment(rootComment.getCommentContent());
                    dto.setCreatedAt(rootComment.getCommentCreatedAt());
                    dto.setUpdatedAt(rootComment.getCommentUpdatedAt());
                    dto.setCommentId(rootComment.getId());

                    // 7 Lấy comment con (dùng đệ quy tối đa 5 cấp)
                    List<ProductReviewDTO> childComments = getChildComments(rootComment.getId(), 5);
                    dto.setChildComments(childComments);
                    break; // Chỉ có một comment gốc nên thoát khỏi vòng lặp
                }
            }
            productReviewDTOList.add(dto);
        }
        return productReviewDTOList;
    }

    private List<ProductReviewDTO> getChildComments(Integer parentId, int level) {
        if (level == 0) return new ArrayList<>(); // Dừng đệ quy nếu quá 5 cấp

        List<ProductReviewDTO> childCommentDTOs = new ArrayList<>();
        List<Comment> childComments = reviewRepository.findChildComments(parentId);

        for (Comment childComment : childComments) {
            ProductReviewDTO childDto = new ProductReviewDTO();
            childDto.setCommentId(childComment.getId());
            childDto.setReviewComment(childComment.getCommentContent());
            childDto.setCreatedAt(childComment.getCommentCreatedAt());
            childDto.setUpdatedAt(childComment.getCommentUpdatedAt());

            // Lấy userImage và userUsername từ review của comment
            childDto.setUserImage(childComment.getReview().getUser().getUserImage());
            childDto.setFullName(childComment.getReview().getUser().getUsername());

            // Gọi đệ quy để lấy các comment con tiếp theo
            childDto.setChildComments(getChildComments(childComment.getId(), level - 1));

            childCommentDTOs.add(childDto);
        }
        return childCommentDTOs;
    }

    public List<Review> getReviewsByOrderDetailId(Integer variationSingleId) {
        return reviewRepository.findReviewsByOrderDetailId(variationSingleId);
    }

    @Transactional
    public Review addReview(ReviewDTO review) {
        boolean reviewExists = checkReviewExists(review.getProductId(), review.getOrderId(), review.getUserId());
        if (reviewExists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User has already reviewed this product for this order.");
        }

        // Kiểm tra productId có tồn tại không
        Product product = productRepository.findById(review.getProductId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));

        // Kiểm tra orderId có tồn tại không
        Order order = orderRepository.findById(review.getOrderId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found."));

        // Kiểm tra userId có tồn tại không
        User user = userRepository.findById(review.getUserId()).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        if (review.getReviewRating() < 1 || review.getReviewRating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Review rating must be between 1 and 5.");
        }

        Review newReview = new Review();
        newReview.setReviewRating(review.getReviewRating());
        newReview.setProduct(product);
        newReview.setOrder(order);
        newReview.setUser(user);

        try {
            Review savedReview = reviewRepository.save(newReview);
            Comment newComment = new Comment();
            newComment.setReview(savedReview);
            newComment.setCommentContent(review.getReviewComment());
            commentRepository.save(newComment);
            return savedReview;
        } catch (Exception e) {
            System.err.println("Error saving review and comment: " + e.getMessage());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving review and comment.");
        }
    }


    @Transactional
    public Comment updateComment(Integer commentId, String username, CommentUpdateRequestDTO updateRequestDTO) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found with id: " + commentId));

        // Kiểm tra xem user có tồn tại trong database không
        if (!userRepository.existsByUserUsername(username)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }


        // Kiểm tra xem người dùng có phải là người tạo comment không
        if (!comment.getReview().getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to update this comment.");
        }

        // Kiểm tra xem comment đã được chỉnh sửa chưa. Nếu commentUpdatedAt khác commentCreatedAt, nghĩa là đã chỉnh sửa.
        if (!comment.getCommentCreatedAt().equals(comment.getCommentUpdatedAt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This comment has already been updated once and cannot be updated again.");
        }

        comment.setCommentContent(updateRequestDTO.getCommentContent());
        return commentRepository.save(comment);
    }


    public List<Review> getReviewsByUserName(String userName) {
        return reviewRepository.findAllByUser_Username(userName);
    }

    public boolean checkReviewExists(String productId, String orderId, String userId) {
        return reviewRepository.existsByProduct_ProductIdAndOrder_OrderIdAndUser_UserId(productId, orderId, userId);
    }

    public Page<DashboardReviewDTO> getAllDashboardReviews(Pageable pageable) {
        // Gọi repository để lấy dữ liệu từ database
        Page<DashboardReviewDTO> pageResult = reviewRepository.findAllDashboardReviewsOrderByCreatedAtDesc(pageable);
        // Xử lý mỗi review để chỉ lấy một variationImage duy nhất
        List<DashboardReviewDTO> processedContent = pageResult.getContent().stream()
                .map(reviewDTO -> {
                    // Nếu reviewDTO có nhiều variationImage, chỉ lấy phần tử đầu tiên
                    if (reviewDTO.getVariationImage() != null && !reviewDTO.getVariationImage().isEmpty()) {
                        reviewDTO.setVariationImage(reviewDTO.getVariationImage()); // Lấy ảnh variation đầu tiên
                    }
                    boolean isMaxReply = findCommentLevel(reviewDTO.getCommentId(), 1); // Bắt đầu đệ quy từ level 1
                    reviewDTO.setMaxReply(isMaxReply);
                    return reviewDTO;
                })
                .collect(Collectors.toList());

        // Tạo một Page mới với danh sách đã được xử lý
        return new PageImpl<>(processedContent, pageable, pageResult.getTotalElements());
    }

    public boolean findCommentLevel(Integer commentId, int level) {
        if (level >= 6) {
            return true; // Đạt level tối đa
        }
        Integer parentCommentId = reviewRepository.findParentComments(commentId);
        if (parentCommentId != null) {
            return findCommentLevel(parentCommentId, level + 1); // Đệ quy lên level tiếp theo
        } else {
            return false; // Không có comment cha, hoặc đã đến gốc và chưa đạt level 5
        }
    }
}
