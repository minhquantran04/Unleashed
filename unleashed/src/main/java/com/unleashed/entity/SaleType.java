package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sale_type", schema = "public")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SaleType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sale_type_id_gen")
    @SequenceGenerator(name = "sale_type_id_gen", sequenceName = "sale_type_sale_type_id_seq", allocationSize = 1)
    @Column(name = "sale_type_id", nullable = false)
    private Integer id;

    @Column(name = "sale_type_name", length = Integer.MAX_VALUE)
    private String saleTypeName;

//    @OneToMany(mappedBy = "saleType")
//    private Set<Sale> sales = new LinkedHashSet<>();
}
