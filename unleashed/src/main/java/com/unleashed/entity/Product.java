package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "product", schema = "public")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @SequenceGenerator(name = "product_id_gen", sequenceName = "category_category_id_seq", allocationSize = 1)
    @Column(name = "product_id", nullable = false, length = Integer.MAX_VALUE)
    private String productId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_status_id")
    private ProductStatus productStatus;

    @Column(name = "product_name", length = Integer.MAX_VALUE)
    private String productName;

    @Column(name = "product_code", length = Integer.MAX_VALUE)
    private String productCode;

    @Column(name = "product_description", length = Integer.MAX_VALUE)
    private String productDescription;

    @Column(name = "product_created_at")
    private OffsetDateTime productCreatedAt;

    @Column(name = "product_updated_at")
    private OffsetDateTime productUpdatedAt;

    //DON'T TOUCH
    //I don't know how, but without this, half of the import code will turn into Jews
    //Phat: It need to ignore, loop too much, please set it back to lazy
    @JsonIgnore
    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonView(Views.ProductView.class)
    private List<Variation> productVariations = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "product_category",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id"))
    private List<Category> categories = new ArrayList<>();

    @PrePersist
    protected void onPrePersist() {
        setProductCreatedAt(OffsetDateTime.now());
        setProductUpdatedAt(OffsetDateTime.now());

        //THIS IS USED TO GENERATE PRODUCT CODE
        //IT RUNS AUTOMATICALLY SO PLEASE DON'T TOUCH
        if (this.productCode == null && this.productName != null) {
            String codePrefix = generateProductCodePrefix(this.productName);
            String randomNumbers = RandomStringUtils.randomNumeric(3);
            this.productCode = codePrefix + randomNumbers;
        }
    }

    @PreUpdate
    protected void onPreUpdate() {
        setProductUpdatedAt(OffsetDateTime.now());
    }

    // HELPER TO GENERATE PRODUCT CODE
    private String generateProductCodePrefix(String productName) {
        StringBuilder prefix = new StringBuilder();
        int charCount = 0;
        for (char c : productName.toCharArray()) {
            if (charCount < 3) {
                if (c != ' ') {
                    prefix.append(Character.toUpperCase(c));
                    charCount++;
                }
            } else {
                break;
            }
        }
        return prefix.toString();
    }
}