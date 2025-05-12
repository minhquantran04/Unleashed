package com.unleashed.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "chat", schema = "public")
public class Chat {
    @Id
    @ColumnDefault("nextval('chat_chat_id_seq')")
    @Column(name = "chat_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private com.unleashed.entity.User userId;

    @Column(name = "chat_created_at")
    private OffsetDateTime chatCreatedAt;

    @OneToMany(mappedBy = "chat")
    private Set<Message> messages = new LinkedHashSet<>();

    @PrePersist
    protected void onCreate() {
        setChatCreatedAt(OffsetDateTime.now());
    }
}