package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.entity.ComposeKey.StockVariationId;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "stock_variation", schema = "public")
public class StockVariation {
    @SequenceGenerator(name = "stock_variation_id_gen", sequenceName = "stock_stock_id_seq", allocationSize = 1)
    @EmbeddedId
    private StockVariationId id;

    @Column(name = "stock_quantity")
    @JsonView(Views.TransactionView.class)
    private Integer stockQuantity;

}