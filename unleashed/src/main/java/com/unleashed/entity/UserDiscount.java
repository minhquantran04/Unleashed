package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.UserDiscountId;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "user_discount", schema = "public")
public class UserDiscount {
    @SequenceGenerator(name = "user_discount_id_gen", sequenceName = "transaction_type_transaction_type_id_seq", allocationSize = 1)
    @EmbeddedId
    private UserDiscountId id;

    @Column(name = "is_discount_used")
    private Boolean isDiscountUsed;

    @Column(name = "discount_used_at")
    private OffsetDateTime discountUsedAt;

}