package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "provider", schema = "public")
public class Provider {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "provider_id_gen")
    @SequenceGenerator(name = "provider_id_gen", sequenceName = "provider_provider_id_seq", allocationSize = 1)
    @Column(name = "provider_id", nullable = false)
    private Integer id;

    @Column(name = "provider_name")
    @JsonView(Views.TransactionView.class)
    private String providerName;

    @Column(name = "provider_image_url")
    private String providerImageUrl;

    @Column(name = "provider_email")
    private String providerEmail;

    @Column(name = "provider_phone", length = 12)
    private String providerPhone;

    @Column(name = "provider_address")
    private String providerAddress;

    @Column(name = "provider_created_at")
    private OffsetDateTime providerCreatedAt;

    @Column(name = "provider_updated_at")
    private OffsetDateTime providerUpdatedAt;

    @OneToMany(mappedBy = "provider")
    @JsonIgnore
    private Set<Transaction> transactions = new LinkedHashSet<>();

    @PrePersist
    protected void onPrePersist() {
        setProviderCreatedAt(OffsetDateTime.now());
        setProviderUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    protected void onPreUpdate() {
        setProviderUpdatedAt(OffsetDateTime.now());
    }
}