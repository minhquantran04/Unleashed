package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "shipping_method", schema = "public")
public class ShippingMethod {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "shipping_method_id_gen")
    @SequenceGenerator(name = "shipping_method_id_gen", sequenceName = "shipping_method_shipping_method_id_seq", allocationSize = 1)
    @Column(name = "shipping_method_id", nullable = false)
    private Integer id;

    @Column(name = "shipping_method_name", length = Integer.MAX_VALUE)
    private String shippingMethodName;

//    @OneToMany(mappedBy = "shippingMethod")
//    private Set<Order> orders = new LinkedHashSet<>();

}