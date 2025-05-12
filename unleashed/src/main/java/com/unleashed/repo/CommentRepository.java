package com.unleashed.repo;

import com.unleashed.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Integer> {
    @Query("SELECT c FROM Comment c " +
            "JOIN CommentParent cp ON c.id = cp.id.commentId " +
            "WHERE cp.id.commentParentId = :parentCommentId")
        // Lấy comment con theo comment gốc
    List<Comment> findChildCommentsByParentCommentId(@Param("parentCommentId") Integer parentCommentId);
}