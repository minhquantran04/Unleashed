package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "color", schema = "public")
public class Color {
    @Id
    @ColumnDefault("nextval('color_color_id_seq')")
    @Column(name = "color_id", nullable = false)
    @JsonView(Views.ProductView.class)
    private Integer id;

    @Column(name = "color_name", length = Integer.MAX_VALUE)
    @JsonView({Views.TransactionView.class, Views.ProductView.class})
    private String colorName;

    @Column(name = "color_hex_code", length = Integer.MAX_VALUE)
    @JsonView({Views.TransactionView.class, Views.ProductView.class})
    private String colorHexCode;

    // @OneToMany(mappedBy = "color")
    // private Set<Variation> variations = new LinkedHashSet<>();
}