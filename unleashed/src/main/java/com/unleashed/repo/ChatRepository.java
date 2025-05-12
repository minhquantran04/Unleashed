package com.unleashed.repo;

import com.unleashed.entity.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Integer> {

    // Find chats involving a specific user
    @Query("SELECT c FROM Chat c WHERE c.userId.userId = :userId")
    List<Chat> findChatsByUserId(@Param("userId") String userId);

    // Find chats created after a specific date/time.
    List<Chat> findByChatCreatedAtAfter(OffsetDateTime dateTime);
}