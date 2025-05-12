package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sale_status", schema = "public")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class SaleStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sale_status_id_gen")
    @SequenceGenerator(name = "sale_status_id_gen", sequenceName = "sale_status_sale_status_id_seq", allocationSize = 1)
    @Column(name = "sale_status_id", nullable = false)
    private Integer id;

    @Column(name = "sale_status_name", length = Integer.MAX_VALUE)
    private String saleStatusName;

//    @OneToMany(mappedBy = "saleStatus")
//    private Set<Sale> sales = new LinkedHashSet<>();
}
