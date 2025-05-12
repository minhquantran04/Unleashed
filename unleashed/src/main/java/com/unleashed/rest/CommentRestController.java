package com.unleashed.rest;

import com.unleashed.dto.CommentDTO;
import com.unleashed.entity.Comment;
import com.unleashed.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/comments")
public class CommentRestController {

    private final CommentService commentService;

    public CommentRestController(CommentService commentService) {
        this.commentService = commentService;
    }

//    @PreAuthorize("hasAuthority('CUSTOMER')")
//    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentDTO newComment) {
        try {
            Comment savedComment = commentService.createComment(newComment);
            return ResponseEntity.ok(savedComment);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/admin")
    public ResponseEntity<?> createAdminComment(@RequestBody CommentDTO newComment) {
        try {
            if (newComment == null) {
                return ResponseEntity.badRequest().body("Comment data must not be null.");
            }

            // Optionally check required fields inside CommentDTO
            if (newComment.getComment() == null || newComment.getComment().getCommentContent().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Comment content must not be empty.");
            }

            Comment savedComment = commentService.createComment(newComment);
            return ResponseEntity.ok(savedComment);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
