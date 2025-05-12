package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "rank", schema = "public")
public class Rank {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rank_id_gen")
    @SequenceGenerator(name = "rank_id_gen", sequenceName = "rank_rank_id_seq", allocationSize = 1)
    @Column(name = "rank_id", nullable = false)
    private Integer id;

    @Column(name = "rank_name", length = Integer.MAX_VALUE)
    private String rankName;

    @Column(name = "rank_num")
    private Integer rankNum;

    @Column(name = "rank_payment_requirement", precision = 10, scale = 2)
    private BigDecimal rankPaymentRequirement;

    @Column(name = "rank_base_discount", precision = 3, scale = 2)
    private BigDecimal rankBaseDiscount;

    @JsonIgnore
    @OneToMany(mappedBy = "discountRankRequirement")
    private Set<Discount> discounts = new LinkedHashSet<>();


}