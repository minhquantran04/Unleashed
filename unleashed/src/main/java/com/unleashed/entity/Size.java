package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "size", schema = "public")
public class Size {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "size_id_gen")
    @SequenceGenerator(name = "size_id_gen", sequenceName = "size_size_id_seq", allocationSize = 1)
    @Column(name = "size_id", nullable = false)
    private Integer id;

    @Column(name = "size_name", length = Integer.MAX_VALUE)
    @JsonView({Views.ProductView.class, Views.TransactionView.class})
    private String sizeName;

    // @OneToMany(mappedBy = "size")
    // private Set<Variation> variations = new LinkedHashSet<>();
}