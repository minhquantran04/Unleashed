package com.unleashed.entity.ComposeKey;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class UserDiscountId implements java.io.Serializable {
    private static final long serialVersionUID = 7028597374736487727L;
    @Column(name = "user_id", length = Integer.MAX_VALUE)
    private String userId;

    @Column(name = "discount_id")
    private Integer discountId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        UserDiscountId entity = (UserDiscountId) o;
        return Objects.equals(this.discountId, entity.discountId) &&
                Objects.equals(this.userId, entity.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(discountId, userId);
    }

}