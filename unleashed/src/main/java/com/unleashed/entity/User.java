package com.unleashed.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.util.Views;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "\"user\"", schema = "public")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @SequenceGenerator(name = "user_id_gen", sequenceName = "transaction_type_transaction_type_id_seq", allocationSize = 1)
    @Column(name = "user_id", nullable = false, length = Integer.MAX_VALUE)
    private String userId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @Column(name = "is_user_enabled")
    private Boolean isUserEnabled;

    @JsonIgnore
    @Column(name = "user_google_id", length = Integer.MAX_VALUE)
    private String userGoogleId;

    @Column(name = "user_username", length = Integer.MAX_VALUE)
    @JsonView(Views.TransactionView.class)
    private String userUsername;


    @Column(name = "user_password", length = Integer.MAX_VALUE)
    private String userPassword;

    @Column(name = "user_fullname", length = Integer.MAX_VALUE)
    private String userFullname;

    @Column(name = "user_email", length = Integer.MAX_VALUE)
    private String userEmail;

    @Column(name = "user_phone", length = 12)
    private String userPhone;

    @Column(name = "user_birthdate", length = Integer.MAX_VALUE)
    private String userBirthdate;

    @Column(name = "user_address", length = Integer.MAX_VALUE)
    private String userAddress;

    @Column(name = "user_image", length = Integer.MAX_VALUE)
    private String userImage;

    @Column(name = "user_current_payment_method", length = Integer.MAX_VALUE)
    private String userCurrentPaymentMethod;

    @Column(name = "user_created_at")
    private OffsetDateTime userCreatedAt;

    @Column(name = "user_updated_at")
    private OffsetDateTime userUpdatedAt;

    @JsonIgnore
    @OneToOne(mappedBy = "user")
    private UserRank userRank;


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.getRole().getRoleName()));
    }


    @JsonIgnore
    @Override
    public String getPassword() {
        return this.getUserPassword();
    }

    @Override
    public String getUsername() {
        return this.getUserUsername();
    }

    @Override
    public boolean isEnabled() {
        return this.getIsUserEnabled();
    }

    @PrePersist
    public void prePersist() {
        setUserCreatedAt(OffsetDateTime.now());
        setUserUpdatedAt(OffsetDateTime.now());
    }

    @PreUpdate
    public void preUpdate() {
        setUserUpdatedAt(OffsetDateTime.now());
    }
}