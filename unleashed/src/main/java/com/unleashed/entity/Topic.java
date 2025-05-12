package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "topic", schema = "public")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "topic_id_gen")
    @SequenceGenerator(name = "topic_id_gen", sequenceName = "topic_topic_id_seq", allocationSize = 1)
    @Column(name = "topic_id", nullable = false)
    private Integer id;

    @Column(name = "topic_name", length = Integer.MAX_VALUE)
    private String topicName;

    @OneToMany(mappedBy = "topic")
    private Set<Feedback> feedbacks = new LinkedHashSet<>();

}