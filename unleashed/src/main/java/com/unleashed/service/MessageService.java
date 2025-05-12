package com.unleashed.service;

import com.unleashed.entity.Chat;
import com.unleashed.entity.Message;
import com.unleashed.entity.User;
import com.unleashed.repo.ChatRepository;
import com.unleashed.repo.MessageRepository;
import com.unleashed.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository, ChatRepository chatRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    /**
     * Retrieves all messages for a given chat, identified by the customer's user ID.
     *
     * @param customerUserId The ID of the customer user.
     * @return A list of messages for the chat, or an empty list if no chat or messages are found.
     * @throws IllegalArgumentException if the customer user ID is invalid or the user is not a customer.
     */
    @Transactional(readOnly = true)
    public List<Message> getMessagesForCustomerChat(String customerUserId) {
        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid customer user ID: " + customerUserId));

        if (customer.getRole().getId() != 2) { // Assuming role ID 2 is for customers
            throw new IllegalArgumentException("User is not a customer.");
        }

        Optional<Chat> chat = chatRepository.findChatsByUserId(customerUserId).stream().findFirst(); //Find the chat by customer id
        return chat.map(messageRepository::findByChat).orElse(List.of()); //Return messages if chat is found
    }


    /**
     * Sends a message in a chat.  Creates the chat if it doesn't already exist.
     *
     * @param senderId    The ID of the user sending the message.
     * @param customerId  The ID of the customer user.  The chat is associated with the *customer*.
     * @param messageText The content of the message.
     * @return The newly created Message object, or null if an error occurred.
     * @throws IllegalArgumentException if sender or receiver IDs are invalid, or if the sender is not a staff member and is not the customer.
     */
    @Transactional
    public Message sendMessage(String senderId, String customerId, String messageText) {
        if (senderId == null || senderId.isEmpty() || customerId == null || customerId.isEmpty() || messageText == null || messageText.isEmpty()) {
            throw new IllegalArgumentException("Sender ID, customer ID, and message text cannot be null or empty.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid sender user ID: " + senderId));
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid customer user ID: " + customerId));

        // Check if the sender is a staff member OR the customer
        if (sender.getRole().getId() != 3 && !sender.getUserId().equals(customer.getUserId())) { // Assuming role ID 3 is staff
            throw new IllegalArgumentException("Sender must be a staff member or the customer.");
        }

        // Check if the customer is actually a customer
        if (customer.getRole().getId() != 2) {
            throw new IllegalArgumentException("Receiver is not a customer");
        }


        // Find existing chat, or create a new one if it doesn't exist.  Use the ChatService.
        Chat chat = chatRepository.findChatsByUserId(customerId).stream().findFirst().orElseGet(() -> {
            Chat newChat = new Chat();
            newChat.setUserId(customer); // Set the customer user.
            return chatRepository.save(newChat);
        });

        Message message = new Message();
        message.setChat(chat);
        message.setSender(sender);
        message.setMessageText(messageText);
        message.setMessageSendAt(OffsetDateTime.now()); // Ensure message timestamp
        message.setIsMessageEdited(false);  // Initialize as not edited.
        message.setIsMessageDeleted(false); // Initialize as not deleted.

        return messageRepository.save(message);
    }


    /**
     * Edits an existing message.
     *
     * @param messageId      The ID of the message to edit.
     * @param editorId       The ID of the user editing the message.
     * @param newMessageText The new text content of the message.
     * @return The updated Message object, or null if the message is not found or if the editor is not authorized.
     * @throws IllegalArgumentException if the messageId or editorId is null or if newMessageText is empty.
     */
    @Transactional
    public Message editMessage(Integer messageId, String editorId, String newMessageText) {
        if (messageId == null || editorId == null || editorId.isEmpty() || newMessageText == null || newMessageText.trim().isEmpty()) {
            throw new IllegalArgumentException("Message ID, editor ID, and new message text cannot be null or empty.");
        }

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        User editor = userRepository.findById(editorId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid editor user ID: " + editorId));


        // Check authorization: Only the original sender or a staff member can edit.
        if (!message.getSender().getUserId().equals(editorId) && editor.getRole().getId() != 3) {
            throw new IllegalArgumentException("User not authorized to edit this message.");
        }
        message.setMessageText(newMessageText);
        message.setIsMessageEdited(true);
        //Optionally: message.setMessageEditedAt(OffsetDateTime.now());
        return messageRepository.save(message);
    }


    /**
     * Deletes a message.  Implements "soft delete" by marking the message as deleted.
     *
     * @param messageId The ID of the message to delete.
     * @param deleterId The ID of the user deleting the message.
     * @return The updated Message object (with isMessageDeleted set to true), or null if not found or unauthorized.
     * @throws IllegalArgumentException if the messageId or deleterId is null or if newMessageText is empty.
     */
    @Transactional
    public Message deleteMessage(Integer messageId, String deleterId) {
        if (messageId == null || deleterId == null || deleterId.isEmpty()) {
            throw new IllegalArgumentException("Message ID and deleter ID cannot be null or empty.");
        }

        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found with ID: " + messageId));

        User deleter = userRepository.findById(deleterId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid deleter user ID: " + deleterId));

        // Authorization check: Only the sender or a staff member can delete.
        if (!message.getSender().getUserId().equals(deleterId) && deleter.getRole().getId() != 3) {
            throw new IllegalArgumentException("User not authorized to delete this message.");
        }

        message.setIsMessageDeleted(true);
        //Optionally: message.setMessageDeletedAt(OffsetDateTime.now());  // Add a deleted_at timestamp.
        return messageRepository.save(message);
    }

    /**
     * Hard-deletes a message from the database.  This should generally be avoided in a production
     * system, but can be useful for development or administrative tasks.
     *
     * @param messageId id of the message to delete.
     * @throws IllegalArgumentException if the message is not found.
     */
    @Transactional
    public void hardDeleteMessage(Integer messageId) {
        if (messageRepository.existsById(messageId)) {
            messageRepository.deleteById(messageId);
        } else {
            throw new IllegalArgumentException("Message not found: " + messageId);
        }
    }

    /**
     * Retrieves a specific message by ID, checking for authorization.
     *
     * @param messageId The ID of the message.
     * @param userId    The ID of the user requesting the message.
     * @return The Message object if found and the user is authorized, otherwise null.
     */
    @Transactional(readOnly = true)
    public Optional<Message> getMessageById(Integer messageId, String userId) {
        if (messageId == null || userId == null || userId.isEmpty()) {
            throw new IllegalArgumentException("Message ID and User ID cannot be null.");
        }

        Optional<Message> message = messageRepository.findById(messageId);
        if (message.isEmpty()) {
            return Optional.empty(); // or throw an exception
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID: " + userId));

        // Check if the user is authorized to view the message
        boolean isSender = message.get().getSender().getUserId().equals(userId);
        boolean isStaff = user.getRole().getId() == 3;  // Assuming staff role ID is 3.
        //If the message is part of the user's chat
        boolean isChatParticipant = message.get().getChat().getUserId().getUserId().equals(userId);

        if (isSender || isStaff || isChatParticipant) {
            return message;
        } else {
            // User is not authorized to view this message
            return Optional.empty(); //or throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized to access this message");
        }
    }

    /**
     * Searches for messages within a specific customer's chat that contain the given text.
     *
     * @param customerUserId The ID of the customer.
     * @param searchText     The text to search for within the messages.
     * @return A list of messages matching the criteria, or an empty list if none are found.
     */
    @Transactional(readOnly = true)
    public List<Message> searchMessagesInChat(String customerUserId, String searchText) {
        if (customerUserId == null || customerUserId.isEmpty() || searchText == null || searchText.isEmpty()) {
            throw new IllegalArgumentException("Customer user ID and search text cannot be null or empty.");
        }

        User customer = userRepository.findById(customerUserId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid customer user ID: " + customerUserId));

        if (customer.getRole().getId() != 2) {
            throw new IllegalArgumentException("User is not a customer.");
        }

        Optional<Chat> chat = chatRepository.findChatsByUserId(customerUserId).stream().findFirst();
        // No chat found for this customer
        return chat.map(value -> messageRepository.findByChatIdOrderByMessageSendAtAsc(value.getId()).stream()
                .filter(message -> message.getMessageText() != null && message.getMessageText().toLowerCase().contains(searchText.toLowerCase()))
                .toList()).orElseGet(List::of);

    }

    /**
     * Gets a list of messages by their ids.
     *
     * @param messageIds list of message ids.
     * @return list of messages found, can be empty if no messages were found.
     */
    @Transactional(readOnly = true)
    public List<Message> getMessagesByIds(List<Integer> messageIds) {
        return messageRepository.findAllById(messageIds);
    }

}