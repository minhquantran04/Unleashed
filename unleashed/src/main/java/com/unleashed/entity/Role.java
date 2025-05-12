package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "role", schema = "public")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "role_id_gen")
    @SequenceGenerator(name = "role_id_gen", sequenceName = "role_role_id_seq", allocationSize = 1)
    @Column(name = "role_id", nullable = false)
    private Integer id;

    @Column(name = "role_name", length = Integer.MAX_VALUE)
    private String roleName;

}