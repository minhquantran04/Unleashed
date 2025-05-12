package com.unleashed.entity;

import com.unleashed.entity.ComposeKey.SaleProductId;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "sale_product", schema = "public")
public class SaleProduct {
    @SequenceGenerator(name = "sale_product_id_gen", sequenceName = "sale_sale_id_seq", allocationSize = 1)
    @EmbeddedId
    private SaleProductId id;

}