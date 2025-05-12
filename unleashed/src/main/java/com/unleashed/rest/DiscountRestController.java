package com.unleashed.rest;

import com.unleashed.dto.DiscountDTO;
import com.unleashed.service.DiscountService;
import com.unleashed.service.UserService;
import com.unleashed.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discounts")
public class DiscountRestController {

    private static final Logger logger = LoggerFactory.getLogger(DiscountRestController.class);
    private final DiscountService discountService;
    private final JwtUtil jwtUtil;
    private final UserService userService;

    @Autowired
    public DiscountRestController(DiscountService discountService, JwtUtil jwtUtil, UserService userService) {
        this.discountService = discountService;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<?> createDiscount(@RequestBody DiscountDTO discountDTO) {
        //System.out.println(discountDTO.getRank());
        try {
            DiscountDTO createdDiscount = discountService.addDiscount(discountDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDiscount);
        } catch (IllegalArgumentException e) {
            logger.error("Failed to create discount: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/{discountId}")
    public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable int discountId) {
        return discountService.getDiscountById(discountId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Discount ID {} not found.", discountId);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PutMapping("/{discountId}")
    public ResponseEntity<DiscountDTO> updateDiscount(
            @PathVariable Integer discountId,
            @RequestBody DiscountDTO discountDTO) {
        return discountService.updateDiscount(discountId, discountDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Discount ID {} not found for update.", discountId);
                    return ResponseEntity.notFound().build();
                });
    }

    @PreAuthorize("permitAll()")
    @GetMapping
    public ResponseEntity<Page<DiscountDTO>> getAllDiscounts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<DiscountDTO> discounts = discountService.getAllDiscounts(page, size);
        return ResponseEntity.ok(discounts);
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/search")
    public ResponseEntity<DiscountDTO> findDiscountByCode(@RequestParam("code") String discountCode) {
        return discountService.findDiscountByCode(discountCode)
                .map(ResponseEntity::ok)
                .orElseGet(() -> {
                    logger.warn("Discount with code {} not found.", discountCode);
                    return ResponseEntity.notFound().build();
                });
    }

//    @PutMapping("/{discountId}/end")
//    public ResponseEntity<DiscountDTO> endDiscount(@PathVariable int discountId) {
//        Optional<DiscountDTO> discountOpt = discountService.getDiscountById(discountId);
//
//        if (discountOpt.isPresent()) {
//            if (discountOpt.get().getDiscountStatus().equals("EXPIRED")) {
//                logger.info("Discount ID {} is already expired.", discountId);
//                return ResponseEntity.status(HttpStatus.CONFLICT)
//                        .body(discountOpt.get());
//            } else {
//                return discountService.endDiscount(discountId)
//                        .map(ResponseEntity::ok)
//                        .orElseGet(() -> ResponseEntity.notFound().build());
//            }
//        }
//        logger.warn("Discount ID {} not found for ending.", discountId);
//        return ResponseEntity.notFound().build();
//    }


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @DeleteMapping("/{discountId}")
    public ResponseEntity<Void> deleteDiscount(@PathVariable int discountId) {
        discountService.deleteDiscount(discountId);
        logger.info("Deleted discount ID {}", discountId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check-usage")
    public ResponseEntity<Boolean> checkUsage(
            @RequestParam("userId") String userId,
            @RequestParam("discountCode") String discountCode) {
        Optional<DiscountDTO> discountOpt = discountService.findDiscountByCode(discountCode);
        if (!discountOpt.isPresent()) {
            logger.warn("Discount code {} not found for user {}", discountCode, userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(true);
        }
        Boolean used = discountService.checkDiscountUsage(userId, discountCode);
        return ResponseEntity.ok(used);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/{discountId}/users")
    public ResponseEntity<?> addUsersToDiscount(@PathVariable Integer discountId, @RequestBody List<String> userIds) {
        try {
            discountService.addUsersToDiscount(userIds, discountId);
            return ResponseEntity.status(HttpStatus.CREATED).body("Users added to discount.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @DeleteMapping("/{discountId}/users")
    public ResponseEntity<?> removeUserFromDiscount(@PathVariable Integer discountId, @RequestParam String userId) {
        discountService.removeUserFromDiscount(userId, discountId);
        return ResponseEntity.ok("Remove successfully");
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/{discountId}/users")
    public ResponseEntity<Map<String, Object>> getUsersByDiscountId(@PathVariable Integer discountId) {
        Map<String, Object> usersInfo = discountService.getUsersByDiscountId(discountId);
        return ResponseEntity.ok(usersInfo);
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/users/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getDiscountsByUserId(@PathVariable String userId) {
        List<DiscountDTO> discounts = discountService.getDiscountsByUserId(userId);

        // Chuyển đổi DiscountDTO thành dạng bạn yêu cầu
        List<Map<String, Object>> myDiscounts = discounts.stream().map(discount -> {
            Map<String, Object> discountMap = new HashMap<>();
            discountMap.put("discountCode", discount.getDiscountCode());
            discountMap.put("discountType", discount.getDiscountType());
            discountMap.put("discountValue", discount.getDiscountValue());
            discountMap.put("usageCount", discount.getUsageLimit());
            discountMap.put("endDate", discount.getEndDate().toString());  // Chuyển đổi date thành định dạng string

            return discountMap;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(myDiscounts);
    }

    @PreAuthorize("hasAuthority('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<?> getDiscountsByUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            currentUsername = ((UserDetails) authentication.getPrincipal()).getUsername();
        }

        List<DiscountDTO> userDiscounts = discountService.getDiscountsByUserId(userService.getUserInfoByUsername(currentUsername).getUserId());
        return ResponseEntity.ok().body(userDiscounts);
    }


    @PreAuthorize("permitAll()")
    @GetMapping("/check-user-discount")
    public ResponseEntity<?> checkUserDiscount(@RequestParam("discount") String discountCode, @RequestParam("total") BigDecimal subTotal) {
        return discountService.checkUserDiscount(discountCode, subTotal);
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/check-code")
    public ResponseEntity<Boolean> checkDiscountCodeExists(@RequestParam("code") String discountCode) {
        boolean exists = discountService.isDiscountCodeExists(discountCode);
        return ResponseEntity.ok(exists); // Trả về true nếu tồn tại, false nếu không
    }

}