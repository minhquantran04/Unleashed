package com.unleashed.service;

import com.unleashed.entity.Chat;
import com.unleashed.entity.User;
import com.unleashed.repo.ChatRepository;
import com.unleashed.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public ChatService(ChatRepository chatRepository,
                       UserRepository userRepository) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    public Chat Chat(String userId) {
        if (userId != null && !userId.isEmpty()) {
            User user = userRepository.findById(userId).orElseThrow(() ->
                    new IllegalArgumentException("User with ID " + userId + " not found."));

            if (user.getRole().getId() != 2) {
                throw new IllegalArgumentException("User must be CUSTOMER.");
            }

            Optional<Chat> existingChat = chatRepository.findChatsByUserId(userId).stream().findFirst(); // Corrected this
            if (existingChat.isPresent()) {
                return existingChat.get();
            }

            Chat newChat = new Chat();
            newChat.setUserId(user);
            return chatRepository.save(newChat);

        }

        return null;
    }

}
