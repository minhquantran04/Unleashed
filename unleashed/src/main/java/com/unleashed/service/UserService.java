package com.unleashed.service;


import com.unleashed.dto.*;
import com.unleashed.dto.mapper.UserMapper;
import com.unleashed.dto.mapper.ViewUserMapper;
import com.unleashed.entity.Role;
import com.unleashed.entity.User;
import com.unleashed.exception.CustomException;
import com.unleashed.repo.UserRepository;
import com.unleashed.repo.UserRoleRepository;
import com.unleashed.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RestController
@RequestMapping("/api/user")
public class UserService {

    @Autowired

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;
    private final UserRoleService userRoleService;
    private final EmailService emailService;
    private final ViewUserMapper viewUserMapper;
    @Autowired
    private RankService rankService;

    @Autowired
    public UserService(UserRepository userRepository, UserRoleRepository userRoleRepository, JwtUtil jwtUtil, AuthenticationManager authenticationManager, UserMapper userMapper, UserRoleService userRoleService, EmailService emailService, ViewUserMapper viewUserMapper) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;
        this.userRoleService = userRoleService;
        this.emailService = emailService;
        this.viewUserMapper = viewUserMapper;
    }

    @Transactional
    @PutMapping("/update-password")
    public ResponseDTO updatePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {

        ResponseDTO responseDTO = new ResponseDTO();

        try {
            if (changePasswordDTO.getUserEmail() == null || changePasswordDTO.getUserEmail().isEmpty()) {
                throw new CustomException(" User email is missing in request!", HttpStatus.BAD_REQUEST);
            }

            User user = userRepository.findByUserEmail(changePasswordDTO.getUserEmail())
                    .orElseThrow(() -> new CustomException(" User not found", HttpStatus.NOT_FOUND));
            PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getUserPassword())) {
                throw new CustomException(" Password is incorrect", HttpStatus.BAD_REQUEST);
            } else {
                user.setUserPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
                userRepository.save(user);
                responseDTO.setStatusCode(HttpStatus.OK.value());
                responseDTO.setMessage("Password updated successfully!");
            }
        } catch (CustomException e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage("Password update failed!");
        } catch (Exception e) {
            responseDTO.setStatusCode(400);
            responseDTO.setMessage("Password update failed!");
        }
        return responseDTO;
    }

    public ResponseDTO login(UserDTO userDTO) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            User user = userRepository.findByUserUsername(userDTO.getUsername()).orElseThrow(() -> new CustomException("Username or password is wrong! Please try again", HttpStatus.NOT_FOUND));
            if (!user.getIsUserEnabled()) {
                throw new CustomException("User account is disabled. Please contact us for support.", HttpStatus.FORBIDDEN);
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(userDTO.getUsername(), userDTO.getPassword()));
            if (user.getUserGoogleId() != null) {
                throw new CustomException("Please login with Google account", HttpStatus.FORBIDDEN);
            }

            if (rankService.hasRegistered(user) && rankService.isRankExpired(user)) {
                if (rankService.checkDownRank(user)) rankService.downRank(user);
            }

            var token = jwtUtil.generateUserToken(user);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            responseDTO.setToken(token);
            responseDTO.setExpirationTime("1 Day");
            responseDTO.setMessage("Successful");

        } catch (CustomException e) {
            responseDTO.setStatusCode(e.getStatusCode());
            responseDTO.setMessage(e.getMessage());
        } catch (BadCredentialsException e) {
            responseDTO.setStatusCode(HttpStatus.UNAUTHORIZED.value());
            responseDTO.setMessage("Username or password is wrong! Please try again");
        } catch (Exception e) {
            responseDTO.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDTO.setMessage("An unexpected error occurred during login: " + e.getMessage());
        }
        return responseDTO;
    }

    public User findByGoogleId(String googleId) {
        return userRepository.findByUserGoogleId(googleId).orElse(null);
    }

    public User create(User user) {
//        System.out.println("user pass:"+user.getUserPassword());
        PasswordEncoder encode = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2A, 10);
        user.setUserPassword(encode.encode(user.getUserPassword()));
        return userRepository.save(user);
    }

    public ResponseDTO handleGoogleLogin(String googleId, String email, String fullName, String userImage) {
        User user = findByGoogleId(googleId);
//        System.out.println(user);
        String password = email.substring(0, email.indexOf("@")) + email.length(); // Generate a password

        if (user == null) {
            user = new User();
            user.setUserGoogleId(googleId);
            user.setUserUsername(email);
            user.setUserPassword(password);
            user.setUserPhone(user.getUserPhone());
            user.setUserEmail(email);
            user.setUserFullname(fullName);
            user.setUserImage(userImage);
            user.setUserPhone(null);
            user.setRole(userRoleService.findById(2)); // Assuming role ID 2 is for users
            user.setIsUserEnabled(true);
            create(user); // Save user
        }

        if (rankService.hasRegistered(user) && rankService.isRankExpired(user)) {
            if (rankService.checkDownRank(user)) rankService.downRank(user);
        }
        ResponseDTO responseDTO = new ResponseDTO();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUserUsername(), password));
            User userCheck = userRepository.findByUserUsername(email).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
            var token = jwtUtil.generateUserToken(userCheck);
            responseDTO.setStatusCode(HttpStatus.OK.value());
            responseDTO.setToken(token);
            responseDTO.setExpirationTime("1 Day");
            responseDTO.setMessage("Successful");
        } catch (CustomException e) {
            responseDTO.setStatusCode(e.getStatusCode());
            responseDTO.setMessage(e.getMessage());
        } catch (Exception e) {
            responseDTO.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            responseDTO.setMessage("Error During  " + e.getMessage());
        }
        return responseDTO;
    }

    public User findByEmail(String userEmail) {
        return userRepository.findByUserEmail(userEmail).orElse(null);
    }

    public boolean existsByUsername(String username) {
        return userRepository.existsByUserUsername(username);
    }

    public boolean existsByEmail(String userEmail) {
        return userRepository.existsByUserEmail(userEmail);
    }

    public User findById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }


    @Transactional
    public User updatePassword(User user, String newPassword) {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        String encodedPassword = encoder.encode(newPassword);

//        System.out.println("ENCODING PASSWORD: " + encodedPassword);

        user.setUserPassword(encodedPassword);
        return userRepository.save(user);
    }


    @Transactional
    public User updateEnable(User user, boolean enable) {
        user.setIsUserEnabled(enable);
        return userRepository.save(user);
    }

    @Transactional
    public User updateUserInfo(String userId, UpdateUserDTO updatedUserInfo) {
        Optional<User> existingUserOptional = userRepository.findById(userId);

        if (existingUserOptional.isPresent()) {
            User existingUser = existingUserOptional.get();

            // Log toàn bộ dữ liệu từ frontend
//            System.out.println(" Received from frontend: " + updatedUserInfo);

            // Cập nhật thông tin
            existingUser.setUserFullname(updatedUserInfo.getFullName());
            existingUser.setUserImage(updatedUserInfo.getUserImage());


            if (updatedUserInfo.getUserPhone() != null && !updatedUserInfo.getUserPhone().trim().isEmpty()) {
                existingUser.setUserPhone(updatedUserInfo.getUserPhone());
//                System.out.println("Updated userPhone: " + updatedUserInfo.getUserPhone());
            } else {
//                System.out.println("Skipped updating userPhone (null or empty).");
            }

            existingUser.setUserAddress(updatedUserInfo.getUserAddress());


//            System.out.println("Saving to DB: " + existingUser);

            // Lưu vào database
            User updatedUser = userRepository.save(existingUser);

            // Kiểm tra dữ liệu sau khi lưu
//            System.out.println("Saved userPhone in DB: " + updatedUser.getUserPhone());

            return updatedUser;
        } else {
            System.err.println("User not found with ID: " + userId);
            return null;
        }
    }


    public List<User> findAll() {
        return userRepository.findAll();
    }

    public User findByUsername(String username) {
        return userRepository.findByUserUsername(username)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ViewInfoDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        ViewUserMapper viewUserMapper;
        return users.stream()
                .map(user -> new ViewInfoDTO(user.getUserId(),
                        user.getUserUsername(),
                        user.getUserEmail(),
                        user.getUserFullname(),
                        user.getUserPhone(),
                        user.getUserImage(),
                        user.getIsUserEnabled(),
                        user.getRole().getRoleName(),
                        user.getUserCurrentPaymentMethod(),
                        user.getUserAddress(),
                        user.getUserCreatedAt(),
                        user.getUserUpdatedAt(),
                        user.getUserRank() == null ? null : user.getUserRank().getRank()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateUserDetails(String userId, AdminUpdateDTO adminUpdateDTO) throws CustomException {
        User existingUser = findById(userId);
        if (existingUser == null) {
            throw new CustomException("User not found", HttpStatus.NOT_FOUND);
        }
        if (existingUser.getRole().getRoleName().equalsIgnoreCase(userRoleService.findById(1).getRoleName())) {
            throw new CustomException("User is admin", HttpStatus.FORBIDDEN);
        }
        existingUser.setIsUserEnabled(adminUpdateDTO.getEnable());
        userRepository.save(existingUser);
    }

    public PageImpl<User> getAllUser(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "userCreatedAt"));
        List<Role> rolesToInclude = userRoleRepository.findAll();

        Page<User> userPage;
        if (search != null && !search.trim().isEmpty()) {
            userPage = userRepository.findByRolesAndSearch(rolesToInclude, search.trim(), pageable);
        } else {
            userPage = userRepository.findAll(pageable);
        }

        return new PageImpl<>(userPage.getContent(), pageable, userPage.getTotalElements());
    }

    @Transactional
    public boolean deleteUserById(String userId) throws CustomException {
        if (!userRepository.existsById(userId)) {
            throw new CustomException("User not found", HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(userId);
        return true;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public User createStaffAccount(User user) throws CustomException {
        if (existsByEmail(user.getUserEmail())) {
            throw new CustomException("Email already exists!", HttpStatus.BAD_REQUEST);
        }


        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(BCryptPasswordEncoder.BCryptVersion.$2A, 10);
        user.setUserPassword(encoder.encode(user.getPassword()));

        user.setUserImage(user.getUserImage());
        user.setIsUserEnabled(true);

        user.setRole(userRoleService.findById(3));

//        user.setCurrentPaymentMethod(userDTO.getCurrentPaymentMethod());
        user.setUserAddress(user.getUserAddress());

        return userRepository.save(user);
    }

    public User getUserById(String userId) throws CustomException {
        User user = findById(userId);
        if (user == null) {
            throw new CustomException("User not found", HttpStatus.NOT_FOUND);
        }

        return user;
    }


    public ViewInfoDTO getUserInfoByUsername(String username) {
        User user = findByUsername(username);
        if (user != null) {
            return mapUserToViewInfoDTO(user);
        }
        return null;
    }

    private ViewInfoDTO mapUserToViewInfoDTO(User user) {
        ViewInfoDTO viewInfoDTO = new ViewInfoDTO();
        viewInfoDTO.setUserId(user.getUserId());
        viewInfoDTO.setUsername(user.getUserUsername());
        viewInfoDTO.setUserEmail(user.getUserEmail());
        viewInfoDTO.setFullName(user.getUserFullname());
        viewInfoDTO.setUserPhone(user.getUserPhone());
        viewInfoDTO.setUserImage(user.getUserImage());
        viewInfoDTO.setEnable(user.getIsUserEnabled());
        viewInfoDTO.setRole(String.valueOf(user.getRole().getRoleName()));
        viewInfoDTO.setCurrentPaymentMethod(user.getUserCurrentPaymentMethod());
        viewInfoDTO.setUserAddress(user.getUserAddress());
        viewInfoDTO.setUserCreatedAt(user.getUserCreatedAt());
        viewInfoDTO.setUserUpdatedAt(user.getUserUpdatedAt());
        viewInfoDTO.setRank(user.getUserRank() == null ? null : user.getUserRank().getRank());
        return viewInfoDTO;
    }

    public ViewInfoDTO getUserInfoById(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(this::mapUserToViewInfoDTO).orElse(null);
    }

    public UserDTO getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        return new UserDTO(
                user.getUserId(),
                user.getUserUsername(),
                null, // Không trả password
                user.getUserEmail(), // Đảm bảo có userEmail
                user.getUserFullname(),
                user.getUserImage(),
                user.getUserPhone(),
                user.getIsUserEnabled(),
                user.getRole(),
                user.getUserCurrentPaymentMethod(),
                user.getUserAddress(),
                user.getUserCreatedAt(),
                user.getUserUpdatedAt(),
                user.getUserRank().getRank()
        );
    }

    @PutMapping("/updateprofile")
    @Transactional
    public UserDTO updateUserProfile(@RequestBody Map<String, Object> updatedUserInfo) {
        System.out.println("Received update request: " + updatedUserInfo);

        String userId = (String) updatedUserInfo.get("userId");
        if (userId == null || userId.isEmpty()) {
            throw new CustomException("User ID is missing in request!", HttpStatus.BAD_REQUEST);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

        user.setUserEmail((String) updatedUserInfo.get("email"));
        user.setUserFullname((String) updatedUserInfo.get("fullName"));
        user.setUserPhone((String) updatedUserInfo.get("phoneNumber"));
        user.setUserImage((String) updatedUserInfo.get("userImage"));

        userRepository.save(user);

        return new UserDTO(
                user.getUserId(),
                user.getUserUsername(),
                null,
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
                user.getUserRank().getRank()
        );
    }

    public boolean disableAccount(String userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setIsUserEnabled(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void logout(String token) {
        jwtUtil.revokeToken(token);
    }
}