package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "variation", schema = "public")
public class Variation {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "variation_id_gen")
    @SequenceGenerator(name = "variation_id_gen", sequenceName = "variation_variation_id_seq", allocationSize = 1)
    @Column(name = "variation_id", nullable = false)
    @JsonView(Views.ProductView.class)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id")
    //@JsonView(Views.ProductView.class)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "size_id")
    @JsonView(Views.ProductView.class)
    private Size size;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "color_id")
    @JsonView(Views.ProductView.class)
    private Color color;

    @Column(name = "variation_image", length = Integer.MAX_VALUE)
    @JsonView(Views.ProductView.class)
    private String variationImage;

    @Column(name = "variation_price", precision = 10, scale = 2)
    @JsonView(Views.ProductView.class)
    private BigDecimal variationPrice;

    // @OneToMany
    // private Set<Cart> carts = new LinkedHashSet<>();

    // @OneToMany(mappedBy = "variation")
    // private Set<Transaction> transactions = new LinkedHashSet<>();
}