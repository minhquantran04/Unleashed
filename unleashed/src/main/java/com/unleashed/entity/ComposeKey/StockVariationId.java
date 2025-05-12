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
public class StockVariationId implements java.io.Serializable {
    private static final long serialVersionUID = 5366573655920177816L;
    @Column(name = "variation_id")
    private Integer variationId;

    @Column(name = "stock_id")
    private Integer stockId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        StockVariationId entity = (StockVariationId) o;
        return Objects.equals(this.variationId, entity.variationId) &&
                Objects.equals(this.stockId, entity.stockId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(variationId, stockId);
    }

}