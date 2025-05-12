package com.unleashed.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardReviewDTO {
    private Integer commentId;
    private Integer reviewId;
    private String productId;
    private String fullName;
    private String userImage;
    private OffsetDateTime createdAt;
    private String commentContent;
    private Integer reviewRating;
    private String productName;
    private String variationImage;
    private String parentCommentContent;
    private boolean isMaxReply;
}
