package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.WishlistId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "wishlist", schema = "public")
public class Wishlist {
    @SequenceGenerator(name = "wishlist_id_gen", sequenceName = "variation_single_variation_single_id_seq", allocationSize = 1)
    @EmbeddedId
    private WishlistId id;

}