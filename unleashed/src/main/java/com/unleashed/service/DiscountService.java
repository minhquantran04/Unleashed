package com.unleashed.service;

import com.unleashed.dto.DiscountDTO;
import com.unleashed.dto.DiscountUserViewDTO;
import com.unleashed.dto.ResponseDTO;
import com.unleashed.dto.mapper.UserMapper;
import com.unleashed.entity.ComposeKey.UserDiscountId;
import com.unleashed.entity.*;
import com.unleashed.repo.*;
import com.unleashed.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DiscountService {

    private static final Logger logger = LoggerFactory.getLogger(DiscountService.class);
    private final DiscountRepository discountRepository;
    private final UserDiscountRepository userDiscountRepository;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final DiscountStatusRespository discountStatusRespository;
    private final DiscountTypeRepository discountTypeRepository;
    private final RankRepository rankRepository;


    @Autowired
    public DiscountService(DiscountRepository discountRepository,
                           UserDiscountRepository userDiscountRepository,
                           UserRepository userRepository,
                           JwtUtil jwtUtil,
                           UserMapper userMapper, DiscountStatusRespository discountStatusRespository, DiscountTypeRepository discountTypeRepository, RankRepository rankRepository) {
        this.discountRepository = discountRepository;
        this.userDiscountRepository = userDiscountRepository;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
        this.discountStatusRespository = discountStatusRespository;
        this.discountTypeRepository = discountTypeRepository;
        this.rankRepository = rankRepository;
    }

    public boolean isDiscountCodeExists(String discountCode) {
        return discountRepository.findByDiscountCode(discountCode).isPresent();
    }

    public Page<DiscountDTO> getAllDiscounts(int page, int size) {
//        System.out.println(discountRepository.findAll(
//                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "discountId"))
//        ).getContent());
        return discountRepository.findAll(
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "discountId"))
        ).map(this::convertToDTO);
    }

    public Optional<DiscountDTO> getDiscountById(int discountId) {
        return discountRepository.findById(discountId).map(this::convertToDTO);
    }

    @Transactional
    public DiscountDTO addDiscount(DiscountDTO discountDTO) {
        DiscountStatus inactiveDiscountStatus = discountStatusRespository.findByDiscountStatusName("INACTIVE");
        // Kiểm tra ngày bắt đầu và kết thúc
        if (discountDTO.getStartDate() != null && discountDTO.getEndDate() != null &&
                discountDTO.getStartDate().isAfter(discountDTO.getEndDate())) {
            throw new IllegalArgumentException("Start date cannot be after end date.");
        }

        if (discountDTO.getEndDate().isBefore(OffsetDateTime.now()) || discountDTO.getStartDate().isAfter(OffsetDateTime.now())) {
            discountDTO.setDiscountStatus(inactiveDiscountStatus);
        }

        if (discountDTO.getUsageCount() == null) {
            discountDTO.setUsageCount(0);
        }

        Discount discount = convertToEntity(discountDTO);

        return convertToDTO(discountRepository.save(discount));
    }

    @Transactional
    public Optional<DiscountDTO> updateDiscount(Integer discountId, DiscountDTO discountDTO) {
        Optional<Discount> discountOpt = discountRepository.findById(discountId);
        DiscountStatus inactiveDiscountStatus = discountStatusRespository.findByDiscountStatusName("INACTIVE");
        if (discountOpt.isPresent()) {
            Discount updatedDiscount = convertToEntity(discountDTO);
            updatedDiscount.setDiscountId(discountId);

            // Cập nhật createdAt chỉ khi cần thiết
            if (discountOpt.get().getDiscountCreatedAt() != null) {
                updatedDiscount.setDiscountCreatedAt(discountOpt.get().getDiscountCreatedAt());
            }

            // Thiết lập updatedAt là thời điểm hiện tại
            updatedDiscount.setDiscountUpdatedAt(OffsetDateTime.now(ZoneId.systemDefault()));


            if (discountOpt.get().getDiscountEndDate().isBefore(OffsetDateTime.now()) || discountOpt.get().getDiscountStartDate().isAfter(OffsetDateTime.now())) {
                updatedDiscount.setDiscountStatus(inactiveDiscountStatus);
            }

            return Optional.of(convertToDTO(discountRepository.save(updatedDiscount)));
        }
        return Optional.empty();
    }

    public Optional<DiscountDTO> findDiscountByCode(String discountCode) {
        return discountRepository.findByDiscountCode(discountCode).map(this::convertToDTO);
    }

    public Optional<DiscountDTO> endDiscount(int discountId) {
        Optional<Discount> discount = discountRepository.findById(discountId);
        if (discount.isPresent()) {
            discount.get().setDiscountStatus(discountStatusRespository.getReferenceById(1));
            return Optional.of(convertToDTO(discountRepository.save(discount.get())));
        }
        return Optional.empty();
    }

    @Transactional
    public void deleteDiscount(int discountId) {
        discountRepository.deleteById(discountId);
    }

    public boolean checkDiscountUsage(String userId, String discountCode) {
        Optional<Discount> discountOpt = discountRepository.findByDiscountCode(discountCode);
        if (!discountOpt.isPresent()) {
            throw new IllegalArgumentException("Discount code not found.");
        }

        Discount discount = discountOpt.get();

        // Kiểm tra nếu discount đã được sử dụng hết
        if (discount.getDiscountUsageLimit() == discount.getDiscountUsageCount()) {
            throw new IllegalStateException("This discount has been fully used by all users.");
        }

        // Kiểm tra số lần sử dụng của user cụ thể
        return userDiscountRepository
                .findById_UserIdAndId_DiscountId(userId, discount.getDiscountId())
                .map(UserDiscount::getIsDiscountUsed)
                .orElse(false); // Mặc định trả về false nếu user chưa từng sử dụng
    }


    @Transactional
    public void addUsersToDiscount(List<String> userIds, Integer discountId) {
        Optional<Discount> discountOpt = discountRepository.findById(discountId);
        if (!discountOpt.isPresent()) {
            throw new ResourceNotFoundException("Discount not found.");
        }

        Discount discount = discountOpt.get();
        List<UserDiscount> userDiscounts = new ArrayList<>();

        for (String userId : userIds) {
            if (!userDiscountRepository.existsById_UserIdAndId_DiscountId(userId, discountId)) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
                UserDiscount userDiscount = new UserDiscount();
                UserDiscountId userDiscountId = new UserDiscountId();
                userDiscountId.setUserId(user.getUserId());
                userDiscountId.setDiscountId(discount.getDiscountId());
                userDiscount.setId(userDiscountId);
                userDiscount.setIsDiscountUsed(false); // Mặc định false khi chưa sử dụng
                userDiscounts.add(userDiscount);
            }
        }

        if (!userDiscounts.isEmpty()) {
            userDiscountRepository.saveAll(userDiscounts);
        }
    }


    @Transactional
    public void removeUserFromDiscount(String userId, Integer discountId) {
        UserDiscountId userDiscountId = new UserDiscountId(userId, discountId);
        Optional<UserDiscount> userDiscountOpt = userDiscountRepository.findById_UserIdAndId_DiscountId(userId, discountId);
        userDiscountOpt.ifPresent(userDiscountRepository::delete);
    }

    @Transactional
    public List<DiscountDTO> getDiscountsByUserId(String userId) {
        List<UserDiscount> userDiscounts = userDiscountRepository.findAllById_UserId(userId);

        return userDiscounts.stream()
                .map(userDiscount -> {
                    Discount discount = discountRepository.findById(userDiscount.getId().getDiscountId())
                            .orElseThrow(() -> new IllegalArgumentException("Invalid discount ID"));

                    // Kiểm tra trạng thái và trả về DTO
                    if (discount.getDiscountStatus().getDiscountStatusName().equalsIgnoreCase("EXPIRED") ||
                            discount.getDiscountStatus().getDiscountStatusName().equalsIgnoreCase("INACTIVE")) {
                        return null; // Bỏ qua các discount không hợp lệ
                    }

                    if (discount.getDiscountEndDate().isBefore(OffsetDateTime.now()) || discount.getDiscountStartDate().isAfter(OffsetDateTime.now())) {
                        DiscountStatusRespository discountStatusRepository;
                        DiscountStatus inactiveDiscountStatus = discountStatusRespository.findByDiscountStatusName("INACTIVE"); // Tìm DiscountStatus có tên là "INACTIVE"
                        if (inactiveDiscountStatus != null) {
                            discount.setDiscountStatus(inactiveDiscountStatus); // **Đặt discountStatus của discount thành INACTIVE**
                        }
                        return null;
                    }

                    return convertToDTO(discount);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }


    public Map<String, Object> getUsersByDiscountId(Integer discountId) {
        List<UserDiscount> userDiscounts = userDiscountRepository.findAllById_DiscountId(discountId);

        Set<String> allowedUserIds = userDiscounts.stream()
                .map(userDiscount -> userDiscount.getId().getUserId())
                .collect(Collectors.toSet());

        List<DiscountUserViewDTO> users = userDiscounts.stream()
                .map(userDiscount -> userRepository.findById(userDiscount.getId().getUserId())
                        .map(user -> new DiscountUserViewDTO(
                                user.getUserId(),
                                user.getUserUsername(),
                                user.getUserEmail(),
                                user.getUserFullname(),
                                user.getUserImage()
                        ))
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("userDiscounts", userDiscounts);
        result.put("allowedUserIds", allowedUserIds);

        return result;
    }

    public ResponseEntity<?> checkUserDiscount(String discountCode, BigDecimal subTotal) {
        DecimalFormat decimalFormat = new DecimalFormat("#,##0.00");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = null;
        DiscountStatus inactiveDiscountStatus = discountStatusRespository.findByDiscountStatusName("INACTIVE");
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        }

        if (currentUsername == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ResponseDTO(HttpStatus.UNAUTHORIZED.value(), "User not authenticated"));
        }

        String userId = userRepository.findByUserUsername(currentUsername)
                .map(User::getUserId)
                .orElse(null);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(HttpStatus.NOT_FOUND.value(), "User ID not found for authenticated user"));
        }

        Optional<DiscountDTO> discountOpt = findDiscountByCode(discountCode);
        if (!discountOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(HttpStatus.NOT_FOUND.value(), "Discount code not found"));
        }

        Map<String, Object> discountUsersData = getUsersByDiscountId(discountOpt.get().getDiscountId());
        Set<String> allowedUserIds = (Set<String>) discountUsersData.get("allowedUserIds");

        if (!allowedUserIds.contains(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ResponseDTO(HttpStatus.FORBIDDEN.value(), "User is not available for this discount"));
        }

        boolean hasDiscount = checkDiscountUsage(userId, discountCode);
        if (!hasDiscount) {
            DiscountDTO discountDTO = discountOpt.get();
            if (discountDTO.getEndDate().isBefore(OffsetDateTime.now()) || discountDTO.getStartDate().isAfter(OffsetDateTime.now())) {
                discountDTO.setDiscountStatus(inactiveDiscountStatus);
            }
            if (Objects.equals(discountDTO.getDiscountStatus().getDiscountStatusName(), "EXPIRED")) {
                return ResponseEntity.status(HttpStatus.GONE).body(new ResponseDTO(HttpStatus.GONE.value(), "Discount expired"));
            }
            if (Objects.equals(discountDTO.getDiscountStatus().getDiscountStatusName(), "INACTIVE")) {
                return ResponseEntity.status(HttpStatus.GONE).body(new ResponseDTO(HttpStatus.GONE.value(), "Discount has reached the limit or INACTIVE! Try another discount."));
            }
            if (discountDTO.getMinimumOrderValue() != null && discountDTO.getMinimumOrderValue().compareTo(subTotal) <= 0) {
                return ResponseEntity.ok(discountDTO);
            } else if (discountDTO.getMinimumOrderValue() == null) {
                return ResponseEntity.ok(discountDTO);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                        new ResponseDTO(HttpStatus.BAD_REQUEST.value(), "The minimum order value is " + decimalFormat.format(discountDTO.getMinimumOrderValue()) + ". Please add more items to your cart.")
                );
            }
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ResponseDTO(HttpStatus.NOT_FOUND.value(), "User used this discount"));
        }
    }

//    @Transactional
//    public void assignNewUserDiscount(String userId) {
//
//        Optional<Discount> newUserDiscountOpt = discountRepository.findByDiscountCode("BELUSTYLEGIFT");
//
//        if (newUserDiscountOpt.isPresent()) {
//            Discount discount = newUserDiscountOpt.get();
//
//
//            Optional<UserDiscount> existingUserDiscount = userDiscountRepository
//                    .findById_UserIdAndId_DiscountId(userId, discount.getDiscountId());
//
//            if (!existingUserDiscount.isPresent()) {
//
//                User user = userRepository.findById(userId)
//                        .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
//
//                UserDiscount userDiscount = new UserDiscount();
//                userDiscount.setId(new UserDiscountId(userId, discount.getDiscountId()));
//
//
//                userDiscount.setIsDiscountUsed(false);
//
//                userDiscountRepository.save(userDiscount);
//
//                discount.setDiscountUsageLimit((discount.getUserDiscounts() == null ? 0 : discount.getDiscountUsageLimit()) + 1);
//
//                discountRepository.save(discount);
//            }
//        } else {
//            throw new ResourceNotFoundException("Default discount BELUSTYLEGIFT not found.");
//        }
//    }


    @Transactional
    public void updateUsageLimit(String discountCode, String userId) {
        // Tìm mã giảm giá
        Optional<Discount> discountOpt = discountRepository.findByDiscountCode(discountCode);
        if (!discountOpt.isPresent()) {
            throw new IllegalArgumentException("Discount code not found.");
        }

        Discount discount = discountOpt.get();

        // Kiểm tra nếu `usage_limit` của mã giảm giá đã hết
        if (discount.getDiscountUsageLimit() == discount.getDiscountUsageCount()) {
            throw new IllegalStateException("This discount has been fully used.");
        }

        // Kiểm tra `UserDiscount` của người dùng hiện tại
        UserDiscount userDiscount = userDiscountRepository
                .findById_UserIdAndId_DiscountId(userId, discount.getDiscountId())
                .orElseThrow(() -> new IllegalStateException("User has not been assigned this discount."));

        // Kiểm tra nếu `usage_count` của người dùng đã hết
        if (userDiscount.getIsDiscountUsed()) {
            throw new IllegalStateException("User has already used this discount.");
        }

        // Giảm `usage_count` của người dùng
        userDiscount.setIsDiscountUsed(true);
        userDiscount.setDiscountUsedAt(OffsetDateTime.now());
        userDiscountRepository.save(userDiscount);

        // Tăng `usage_limit` tổng quan của mã giảm giá
        if (discount.getDiscountUsageCount() < discount.getDiscountUsageLimit()) {
            discount.setDiscountUsageCount(discount.getDiscountUsageCount() + 1);
            if (discount.getDiscountUsageLimit() == discount.getDiscountUsageCount()) {
                // Đặt trạng thái giảm giá thành INACTIVE khi đạt đến giới hạn sử dụng
                DiscountStatusRespository discountStatusRepository;
                DiscountStatus inactiveDiscountStatus = discountStatusRespository.findByDiscountStatusName("INACTIVE"); // Tìm DiscountStatus có tên là "INACTIVE"
                if (inactiveDiscountStatus != null) {
                    discount.setDiscountStatus(inactiveDiscountStatus); // **Đặt discountStatus của discount thành INACTIVE**
                }
            }
        }


        discountRepository.save(discount);
    }


    public DiscountDTO convertToDTO(Discount discount) {
        DiscountDTO discountDTO = new DiscountDTO(
                discount.getDiscountId(),
                discount.getDiscountCode(),
                discount.getDiscountType(),
                discount.getDiscountValue(),
                discount.getDiscountStartDate(),
                discount.getDiscountEndDate(),
                discount.getDiscountStatus(),
                discount.getDiscountDescription(),
                discount.getDiscountMinimumOrderValue(),
                discount.getDiscountMaximumValue(),
                discount.getDiscountUsageLimit(),
                discount.getDiscountRankRequirement(),
                discount.getDiscountUsageCount()
        );

        // Tính toán tổng số lần sử dụng
        int totalUsageCount = userDiscountRepository.countByDiscountId(discount.getDiscountId());
//        discountDTO.setUsageLimit(totalUsageCount);

//        // Cập nhật trạng thái nếu đạt giới hạn
//        if (discount.getDiscountUsageLimit() != null && totalUsageCount >= discount.getDiscountUsageLimit()) {
////            discount.setDiscountStatus(Discount.DiscountStatus.USED);
//            discountRepository.save(discount); // Lưu trạng thái mới
//        }

        return discountDTO;
    }


    private Discount convertToEntity(DiscountDTO discountDTO) {
        Discount discount = new Discount();
        discount.setDiscountCode(discountDTO.getDiscountCode());
//        discount.setDiscountType(jghajshdgfvjhasg);
        discount.setDiscountValue(discountDTO.getDiscountValue());
        discount.setDiscountStartDate(discountDTO.getStartDate());
        discount.setDiscountEndDate(discountDTO.getEndDate());

        DiscountStatus discountStatus = discountStatusRespository.findById(discountDTO.getDiscountStatus().getId())
                .orElseThrow(() -> new ResourceNotFoundException("DiscountStatus not found"));
        discount.setDiscountStatus(discountStatus);

        DiscountType discountType = discountTypeRepository.findById(discountDTO.getDiscountType().getId())
                .orElseThrow(() -> new ResourceNotFoundException("DiscountType not found"));
        discount.setDiscountType(discountType);

        if (discountDTO.getRank() != null) {
            Rank rank = rankRepository.findById(discountDTO.getRank().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Rank not found"));
            discount.setDiscountRankRequirement(rank);
        }

        discount.setDiscountDescription(discountDTO.getDiscountDescription());
        discount.setDiscountMinimumOrderValue(discountDTO.getMinimumOrderValue());
        discount.setDiscountMaximumValue(discountDTO.getMaximumDiscountValue());
        discount.setDiscountUsageLimit(discountDTO.getUsageLimit());
        discount.setDiscountUsageCount(discountDTO.getUsageCount());
        return discount;
    }
}