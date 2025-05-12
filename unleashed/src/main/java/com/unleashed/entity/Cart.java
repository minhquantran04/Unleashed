package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.CartId;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cart", schema = "public")
public class Cart {
    @SequenceGenerator(name = "cart_id_gen", sequenceName = "category_category_id_seq", allocationSize = 1)
    @EmbeddedId
    private CartId id;

    @Column(name = "cart_quantity")
    private Integer cartQuantity;

}