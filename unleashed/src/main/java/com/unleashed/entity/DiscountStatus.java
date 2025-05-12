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
@Table(name = "discount_status", schema = "public")
public class DiscountStatus {
    @Id
    @ColumnDefault("nextval('discount_status_discount_status_id_seq')")
    @Column(name = "discount_status_id", nullable = false)
    private Integer id;

    @Column(name = "discount_status_name", length = Integer.MAX_VALUE)
    private String discountStatusName;


}