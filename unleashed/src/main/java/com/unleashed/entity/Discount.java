package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "discount", schema = "public")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ColumnDefault("nextval('discount_discount_id_seq')")
    @Column(name = "discount_id", nullable = false)
    private Integer discountId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "discount_status_id")
    private com.unleashed.entity.DiscountStatus discountStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "discount_type_id")
    private com.unleashed.entity.DiscountType discountType;

    @Column(name = "discount_code", length = 20)
    private String discountCode;

    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "discount_description", length = Integer.MAX_VALUE)
    private String discountDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "discount_rank_requirement")
    @JsonBackReference
    private com.unleashed.entity.Rank discountRankRequirement;

    @Column(name = "discount_minimum_order_value", precision = 10, scale = 2)
    private BigDecimal discountMinimumOrderValue;

    @Column(name = "discount_maximum_value", precision = 10, scale = 2)
    private BigDecimal discountMaximumValue;

    @Column(name = "discount_usage_limit")
    private Integer discountUsageLimit;

    @Column(name = "discount_start_date")
    private OffsetDateTime discountStartDate;

    @Column(name = "discount_end_date")
    private OffsetDateTime discountEndDate;

    @Column(name = "discount_created_at")
    private OffsetDateTime discountCreatedAt;

    @Column(name = "discount_updated_at")
    private OffsetDateTime discountUpdatedAt;

    @Column(name = "discount_usage_count")
    @ColumnDefault("0")
    private Integer discountUsageCount;

//
//    @OneToMany(mappedBy = "discount")
//    private Set<Order> orders = new LinkedHashSet<>();

//    @JsonIgnore
//    @OneToMany
//    private Set<UserDiscount> userDiscounts = new LinkedHashSet<>();

    @PrePersist
    protected void onCreate() {
        setDiscountCreatedAt(OffsetDateTime.now());
        setDiscountUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    protected void onUpdate() {
        setDiscountUpdatedAt(OffsetDateTime.now());
    }
}