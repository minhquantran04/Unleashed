package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "comment", schema = "public")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comment_id_gen")
    // **Cấu hình ID generation strategy**
    @SequenceGenerator(name = "comment_id_gen", sequenceName = "comment_comment_id_seq", allocationSize = 1)
    // **Khai báo SequenceGenerator**
    @Column(name = "comment_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    @JsonIgnore
    private com.unleashed.entity.Review review;

    @Column(name = "comment_content", columnDefinition = "TEXT") // Thêm columnDefinition = "TEXT" cho kiểu text
    private String commentContent;

    @Column(name = "comment_created_at")
    private OffsetDateTime commentCreatedAt;

    @Column(name = "comment_updated_at")
    private OffsetDateTime commentUpdatedAt;

    @PrePersist
    protected void onCreate() {
        setCommentCreatedAt(OffsetDateTime.now());
        setCommentUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    protected void onUpdate() {
        setCommentUpdatedAt(OffsetDateTime.now());
    }
}