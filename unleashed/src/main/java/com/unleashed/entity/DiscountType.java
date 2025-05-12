package com.unleashed.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "discount_type", schema = "public")
public class DiscountType {
    @Id
    @ColumnDefault("nextval('discount_type_discount_type_id_seq')")
    @Column(name = "discount_type_id", nullable = false)
    private Integer id;

    @Column(name = "discount_type_name", length = Integer.MAX_VALUE)
    private String discountTypeName;

}