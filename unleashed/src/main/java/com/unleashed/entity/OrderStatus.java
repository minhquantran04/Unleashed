package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "order_status", schema = "public")
public class OrderStatus {
    @Id
    @ColumnDefault("nextval('order_status_order_status_id_seq')")
    @Column(name = "order_status_id", nullable = false)
    private Integer id;

    @Column(name = "order_status_name", length = Integer.MAX_VALUE)
    private String orderStatusName;

    @OneToMany(mappedBy = "orderStatus")
    private Set<Order> orders = new LinkedHashSet<>();

}