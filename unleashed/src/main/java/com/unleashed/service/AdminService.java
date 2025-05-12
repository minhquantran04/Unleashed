package com.unleashed.service;

import com.unleashed.dto.UserDTO;
import com.unleashed.entity.User;
import com.unleashed.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;

    @Autowired
    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    public List<UserDTO> searchUsers(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findByUserUsernameContainingOrUserEmailContaining(searchTerm, searchTerm, pageable);

        return users.getContent().stream()
                .map(this::convertToUserDTO) // Chuyển Entity -> DTO
                .collect(Collectors.toList());
    }


    private UserDTO convertToUserDTO(User user) {
        return new UserDTO(
                user.getUserId(),
                user.getUserUsername(),
                null, // Không trả về password vì bảo mật
                user.getUserEmail(),
                user.getUserFullname(),
                user.getUserImage(),
                user.getUserPhone(),
                user.getIsUserEnabled(),
                user.getRole(),
                user.getUserCurrentPaymentMethod(),
                user.getUserAddress(),
                user.getUserCreatedAt(),
                user.getUserUpdatedAt(),
                user.getUserRank() == null ? null : user.getUserRank().getRank()
        );
    }
}
