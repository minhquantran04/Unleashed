package com.unleashed.repo;


import com.unleashed.entity.Chat;
import com.unleashed.entity.Message;
import com.unleashed.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {

    /**
     * Retrieves all messages associated with a specific chat.
     *
     * @param chat The chat entity to fetch messages for.
     * @return A list of messages associated with the given chat.  Returns an empty list if no messages are found.
     */
    List<Message> findByChat(Chat chat);

    /**
     * Finds messages by sender.
     *
     * @param sender The user who sent the messages.
     * @return A list of messages sent by the specified user. Returns an empty list if the user has not sent any messages.
     */
    List<Message> findBySender(User sender);


    /**
     * Retrieves all messages associated with a specific chat ID, ordered by sending time.
     *
     * @param chatId The ID of the chat.
     * @return A list of messages for the given chat ID, ordered by `messageSendAt`.  Returns an empty list if no messages are found.
     */
    @Query("SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.messageSendAt ASC")
    List<Message> findByChatIdOrderByMessageSendAtAsc(@Param("chatId") Integer chatId);

    /**
     * Finds a message by its ID and ensures that the message belongs to specified chat.
     * This method is intended for use case where you not only want to ensure that message exits,
     * but also to authorize that current user has access to the chat
     *
     * @param messageId The ID of the message.
     * @param chatId    the ID of the chat.
     * @return The Message entity if found, otherwise null.
     */
    @Query("SELECT m FROM Message m WHERE m.id = :messageId AND m.chat.id = :chatId")
    Message findByIdAndChatId(@Param("messageId") Integer messageId, @Param("chatId") Integer chatId);

    /**
     * Finds all messages that contain specific text, case-insensitively.
     *
     * @param text The text to search for within the message content.
     * @return A list of messages containing the given text (case-insensitive match). Returns an empty list if no messages contain the text.
     */
    @Query("SELECT m FROM Message m WHERE LOWER(m.messageText) LIKE LOWER(CONCAT('%', :text, '%'))")
    List<Message> findByMessageTextContainingIgnoreCase(@Param("text") String text);
}