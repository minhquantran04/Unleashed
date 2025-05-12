package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.*;
import org.apache.commons.lang3.RandomStringUtils;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "variation_single", schema = "public")
public class VariationSingle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "variation_single_id_gen", sequenceName = "variation_single_variation_single_id_seq", allocationSize = 1)
    @Column(name = "variation_single_id", nullable = false)
    private Integer id;

    @Column(name = "variation_single_code", length = Integer.MAX_VALUE)
    private String variationSingleCode;

    @Column(name = "is_variation_single_bought")
    private Boolean isVariationSingleBought;

//    @OneToMany(mappedBy = "variationSingle")
//    private Set<Review> reviews = new LinkedHashSet<>();

    // Fields needed for code generation
    // PLEASE SET DATA FOR THEM IF YOU WANT TO GENERATE CODE!!!
    @Transient
    private String productCodeForVariationSingle;
    @Transient
    private String colorNameForVariationSingle;
    @Transient
    private String sizeNameForVariationSingle;

    @PrePersist
    public void generateVariationSingleCode() {
        if (this.variationSingleCode == null && productCodeForVariationSingle != null && colorNameForVariationSingle != null && sizeNameForVariationSingle != null) {
            String colorPrefix = colorNameForVariationSingle.toUpperCase();
            String randomNumbers = RandomStringUtils.randomNumeric(6);
            this.variationSingleCode = productCodeForVariationSingle + "-" + colorPrefix + "-" + sizeNameForVariationSingle.toUpperCase() + "-" + randomNumbers;
        }
    }
}