package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleProductId implements java.io.Serializable {
    private static final long serialVersionUID = -3227289640720474307L;
    @Column(name = "sale_id")
    private Integer saleId;

    @Column(name = "product_id", length = Integer.MAX_VALUE)
    private String productId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SaleProductId entity = (SaleProductId) o;
        return Objects.equals(this.saleId, entity.saleId) &&
                Objects.equals(this.productId, entity.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(saleId, productId);
    }

}