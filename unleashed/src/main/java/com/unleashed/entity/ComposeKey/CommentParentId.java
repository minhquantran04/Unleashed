package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class CommentParentId implements java.io.Serializable {
    private static final long serialVersionUID = 1348473216286366455L;
    @Column(name = "comment_id")
    private Integer commentId;

    @Column(name = "comment_parent_id")
    private Integer commentParentId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CommentParentId entity = (CommentParentId) o;
        return Objects.equals(this.commentParentId, entity.commentParentId) &&
                Objects.equals(this.commentId, entity.commentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(commentParentId, commentId);
    }

}