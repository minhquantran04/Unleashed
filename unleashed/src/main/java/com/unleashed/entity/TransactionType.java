package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "transaction_type", schema = "public")
public class TransactionType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "transaction_type_id_gen")
    @SequenceGenerator(name = "transaction_type_id_gen", sequenceName = "transaction_type_transaction_type_id_seq", allocationSize = 1)
    @Column(name = "transaction_type_id", nullable = false)
    private Integer id;

    @Column(name = "transaction_type_name", length = Integer.MAX_VALUE)
    @JsonView(Views.TransactionView.class)
    private String transactionTypeName;


}