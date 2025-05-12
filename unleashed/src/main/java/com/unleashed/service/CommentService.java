package com.unleashed.service;

import com.unleashed.dto.CommentDTO;
import com.unleashed.entity.*;
import com.unleashed.entity.ComposeKey.CommentParentId;
import com.unleashed.repo.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CommentParentRepository commentParentRepository;
    private final ReviewService reviewService;
    private final ProductRepository productRepository;

    public CommentService(CommentRepository commentRepository,
                          ReviewRepository reviewRepository,
                          UserRepository userRepository,
                          CommentParentRepository commentParentRepository, ReviewService reviewService, ProductRepository productRepository) {
        this.commentRepository = commentRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.commentParentRepository = commentParentRepository;
        this.reviewService = reviewService;
        this.productRepository = productRepository;
    }

    @Transactional
    public Comment createComment(CommentDTO commentDTO) {
        // 1. Find user by username
        Optional<User> userOptional = userRepository.findByUserUsername(commentDTO.username);
        if (userOptional.isEmpty()) {
            // If the user is not found, throw an exception
            throw new RuntimeException("User does not exist!");
        }
        User user = userOptional.get();
        // 2. Check if the user has created a review
        List<Review> reviewOptional = reviewRepository.findByUserAndProduct_ProductId(user, commentDTO.productId);
        Optional<Product> reProduct = productRepository.findById(commentDTO.productId);
        if (reProduct.isEmpty()) {
            throw new RuntimeException("Product not found with id: " + commentDTO.productId);
        }
        Product reviewProduct = reProduct.get();
        if (reviewOptional.isEmpty()) {
            // Nếu là ADMIN, tự động tạo review mặc định
            if (user.getRole().getId() == 1 || user.getRole().getId() == 3) {
                Review review = new Review();
                review.setUser(user);
                review.setOrder(null);
                review.setReviewRating(null);
                review.setProduct(reviewProduct);
                review.setComments(null);
                // Lưu vào DB và gán vào reviewOptional
                Review savedReview = reviewRepository.save(review);
                reviewOptional = List.of(savedReview);
            } else {
                throw new RuntimeException("User has not created a review!");
            }
        }

// Lấy review hiện có hoặc review vừa tạo cho ADMIN
        Review review = reviewOptional.get(reviewOptional.size() - 1);

        // 3. Create a new comment
        Comment newComment = new Comment();
        newComment.setReview(review);
        newComment.setCommentContent(commentDTO.comment.getCommentContent());
        // The created and updated timestamps are set automatically via @PrePersist in the entity
        Comment savedComment = commentRepository.save(newComment);

        // 4. If a parentCommentId is provided, create the relationship in the comment_parent table

        if (commentDTO.commentParentId != null) {
            CommentParent commentParent = new CommentParent();
            CommentParentId cpId = new CommentParentId();
            cpId.setCommentParentId(commentDTO.commentParentId);
            cpId.setCommentId(savedComment.getId());
            commentParent.setId(cpId);

            commentParentRepository.save(commentParent);
        }

        return savedComment;
    }
}
