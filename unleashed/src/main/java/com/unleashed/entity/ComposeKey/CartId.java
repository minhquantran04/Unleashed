package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Embeddable
public class CartId implements java.io.Serializable {
    private static final long serialVersionUID = 5945842057963320656L;
    @Column(name = "user_id", length = Integer.MAX_VALUE)
    private String userId;

    @Column(name = "variation_id")
    private Integer variationId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        CartId entity = (CartId) o;
        return Objects.equals(this.variationId, entity.variationId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(variationId, userId);
    }

}