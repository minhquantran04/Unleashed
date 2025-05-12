package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.CommentParentId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "comment_parent", schema = "public")
public class CommentParent {
    @SequenceGenerator(name = "comment_parent_id_gen", sequenceName = "category_category_id_seq", allocationSize = 1)
    @EmbeddedId
    private CommentParentId id;

}