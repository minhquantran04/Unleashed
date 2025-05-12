package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "stock", schema = "public")
@JsonView(Views.ListView.class)
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "stock_id_gen")
    @SequenceGenerator(name = "stock_id_gen", sequenceName = "stock_stock_id_seq", allocationSize = 1)
    @Column(name = "stock_id", nullable = false)
    private Integer id;

    @Column(name = "stock_name", length = Integer.MAX_VALUE)
    private String stockName;

    @Column(name = "stock_address", length = Integer.MAX_VALUE)
    private String stockAddress;
}