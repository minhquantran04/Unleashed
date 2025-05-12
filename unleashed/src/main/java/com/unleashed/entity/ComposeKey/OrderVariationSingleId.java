package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class OrderVariationSingleId implements java.io.Serializable {
    private static final long serialVersionUID = -4125233335205028743L;
    @Column(name = "order_id", length = Integer.MAX_VALUE)
    private String orderId;

    @Column(name = "variation_single_id")
    private Integer variationSingleId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        OrderVariationSingleId entity = (OrderVariationSingleId) o;
        return Objects.equals(this.variationSingleId, entity.variationSingleId) &&
                Objects.equals(this.orderId, entity.orderId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(variationSingleId, orderId);
    }

}