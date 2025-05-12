package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "brand", schema = "public")
public class Brand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id", nullable = false)
    private Integer id;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "brand_description", length = Integer.MAX_VALUE)
    private String brandDescription;

    @Column(name = "brand_image_url")
    private String brandImageUrl;

    @Column(name = "brand_website_url")
    private String brandWebsiteUrl;

    @Column(name = "brand_created_at")
    private OffsetDateTime brandCreatedAt;

    @Column(name = "brand_updated_at")
    private OffsetDateTime brandUpdatedAt;

//    @OneToMany(mappedBy = "brand")
//    @JsonIgnore
//    private Set<Product> products = new LinkedHashSet<>();

    @PrePersist
    public void prePersist() {
        setBrandCreatedAt(OffsetDateTime.now());
        setBrandUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    public void preUpdate() {
        setBrandUpdatedAt(OffsetDateTime.now());
    }
}