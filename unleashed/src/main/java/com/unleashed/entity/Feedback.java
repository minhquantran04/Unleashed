package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "feedback", schema = "public")
public class Feedback {
    @Id
    @ColumnDefault("nextval('feedback_feedback_id_seq')")
    @Column(name = "feedback_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private com.unleashed.entity.Topic topic;

    @Column(name = "feedback_email", length = Integer.MAX_VALUE)
    private String feedbackEmail;

    @Column(name = "feedback_content", length = Integer.MAX_VALUE)
    private String feedbackContent;

    @Column(name = "feedback_created_at")
    private OffsetDateTime feedbackCreatedAt;

    @Column(name = "is_feedback_resolved")
    private Boolean isFeedbackResolved;

    @PrePersist
    protected void onCreate() {
        setFeedbackCreatedAt(OffsetDateTime.now());
    }

}