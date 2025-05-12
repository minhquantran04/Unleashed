package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "transaction", schema = "public")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_id_gen")
    @SequenceGenerator(name = "transaction_id_gen", sequenceName = "transaction_transaction_id_seq", allocationSize = 1)
    @Column(name = "transaction_id", nullable = false)
    @JsonView(Views.TransactionView.class)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_id")
    @JsonView(Views.TransactionView.class)
    private Stock stock;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "variation_id")
    @JsonView(Views.TransactionView.class)
    private com.unleashed.entity.Variation variation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id")
    @JsonView(Views.TransactionView.class)
    private Provider provider;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incharge_employee_id")
    @JsonView(Views.TransactionView.class)
    private com.unleashed.entity.User inchargeEmployee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "transaction_type_id")
    @JsonView(Views.TransactionView.class)
    private com.unleashed.entity.TransactionType transactionType;

    @Column(name = "transaction_quantity")
    @JsonView(Views.TransactionView.class)
    private Integer transactionQuantity;

    @Column(name = "transaction_date")
    @JsonView(Views.TransactionView.class)
    private LocalDate transactionDate;

    @Column(name = "transaction_product_price", precision = 10, scale = 2)
    @JsonView(Views.TransactionView.class)
    private BigDecimal transactionProductPrice;

    @PrePersist
    public void prePersist() {
        setTransactionDate(LocalDate.now());
        setTransactionProductPrice(getVariation().getVariationPrice());
    }
}