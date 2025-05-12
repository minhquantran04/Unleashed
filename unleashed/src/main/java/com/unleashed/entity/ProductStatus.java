package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "product_status", schema = "public")
public class ProductStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_status_id_gen")
    @SequenceGenerator(name = "product_status_id_gen", sequenceName = "product_status_product_status_id_seq", allocationSize = 1)
    @Column(name = "product_status_id", nullable = false)
    private Integer id;

    @Column(name = "product_status_name", length = Integer.MAX_VALUE)
    private String productStatusName;

//    @OneToMany(mappedBy = "productStatus")
//    private Set<Product> products = new LinkedHashSet<>();

}