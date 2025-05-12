package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "payment_method", schema = "public")
public class PaymentMethod {
    @Id
    @ColumnDefault("nextval('payment_method_payment_method_id_seq')")
    @Column(name = "payment_method_id", nullable = false)
    private Integer id;

    @Column(name = "payment_method_name", length = Integer.MAX_VALUE)
    private String paymentMethodName;

    @JsonIgnore
    @OneToMany(mappedBy = "paymentMethod")
    private Set<Order> orders = new LinkedHashSet<>();

}