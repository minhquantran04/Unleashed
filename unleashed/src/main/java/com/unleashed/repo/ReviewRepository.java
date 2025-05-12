package com.unleashed.repo;

import com.unleashed.dto.DashboardReviewDTO;
import com.unleashed.entity.Comment;
import com.unleashed.entity.Review;
import com.unleashed.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    //    @Query("SELECT r.id, u.userUsername, r.reviewRating, c.commentContent, c.commentCreatedAt FROM Review r " + // Chọn c.commentCreatedAt
//            "left join Product p on r.product.productId = p.productId " +
//            "left Join Order o on r.variationSingle.id = ov.id.variationSingleId " +
//            "left join Order o on o.orderId = ov.id.orderId " +
//            "left join User u on u.userId = o.user.userId " +
//            "LEFT JOIN r.comments c " +
//            "WHERE p.productId = :productId " +
//            "ORDER BY r.id DESC")
    // Sắp xếp theo c.commentCreatedAt
    @Query("select o from  Order o ")
    List<Object[]> findReviewByProductId(@Param("productId") String productId);

    // Query 1: Lấy review gốc theo productId
    @Query("SELECT r FROM Review r " +
            "JOIN FETCH r.product p " +
            "JOIN FETCH r.user u " +
            "WHERE p.productId = :productId " +
            "ORDER BY r.id DESC")
    List<Review> findAllReviewsByProductId(@Param("productId") String productId); // Đổi tên query cho rõ ràng

    // Query 2: Lấy tất cả comment cho một list reviewIds
    @Query("SELECT c FROM Comment c " +
            "JOIN FETCH c.review r " +
            "JOIN FETCH r.user u " +
            "WHERE r.id IN :reviewIds " + // Lọc theo list reviewIds
            "ORDER BY c.commentCreatedAt ASC")
    List<Comment> findAllCommentsByReviewIds(@Param("reviewIds") List<Integer> reviewIds); // Query lấy comment theo reviewIds

    @Query("""
                SELECT c FROM Comment c
                WHERE c.id NOT IN (
                    SELECT cp.id.commentId FROM CommentParent cp
                )
                AND c.id IN :commentIds
            """)
    List<Comment> findRootCommentsByCommentIds(@Param("commentIds") List<Integer> commentIds);

    @Query("SELECT c FROM Comment c " +
            "WHERE c.id IN " +
            "(SELECT cp.id.commentId FROM CommentParent cp WHERE cp.id.commentParentId = :commentId)")
    List<Comment> findChildComments(@Param("commentId") Integer commentId);

    @Query("SELECT c.id.commentParentId FROM CommentParent c " +
            "WHERE c.id.commentId = :commentId")
    Integer findParentComments(@Param("commentId") Integer commentId);

    // Phương thức kiểm tra review đã tồn tại cho product và order
    boolean existsByProduct_ProductIdAndOrder_OrderIdAndUser_UserId(String productId, String orderId, String userId);

    @Query("""
                SELECT NEW com.unleashed.dto.DashboardReviewDTO(
                    c.id,
                    r.id,
                    r.product.productId,
                    u.userFullname,
                    u.userImage,
                    c.commentCreatedAt,
                    c.commentContent,
                    CASE
                        WHEN cp IS NULL THEN r.reviewRating
                        ELSE NULL
                    END,
                    r.product.productName,
                    v2.variationImage,
                    parent_comment.commentContent,
                    false
                )
                FROM Comment c
                JOIN c.review r
                JOIN r.user u
                JOIN r.product p
                LEFT JOIN Variation v2 ON v2.product.productId = r.product.productId
                    AND v2.id = (SELECT MIN(v3.id) FROM Variation v3 WHERE v3.product.productId = r.product.productId)
                LEFT JOIN CommentParent cp ON c.id = cp.id.commentId
                LEFT JOIN Comment parent_comment ON cp.id.commentParentId = parent_comment.id
                ORDER BY c.commentCreatedAt DESC
            """)
    Page<DashboardReviewDTO> findAllDashboardReviewsOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COALESCE(count(r.reviewRating), 0) as totalRating, COALESCE(avg(r.reviewRating), 0) as avgRating FROM Review r join Product p on r.product.productId = p.productId WHERE p.productId = :productId")
    List<Object[]> countAndAvgRatingByProductId(@Param("productId") String productId);


//    @Query("SELECT r FROM Review r WHERE r.productId = :productId")
//    List<Review> findReviewDetails(@Param("productId") String productId);

    //    @Query("SELECT r FROM Review r WHERE r.variationSingle.id = :variationSingleId")
    @Query("select r from Review r")
    List<Review> findReviewsByOrderDetailId(@Param("variationSingleId") Integer variationSingleId);

    @Query(
            "select r from Review r " +
                    "where r.user.userUsername = :userUsername"
    )
    List<Review> findAllByUser_Username(String userUsername);

//    Optional<Review> findTopByUserOrderByIdDesc(User user);

    List<Review> findByUser(User user);

    List<Review> findByUserAndProduct_ProductId(User user, String productProductId);
}
