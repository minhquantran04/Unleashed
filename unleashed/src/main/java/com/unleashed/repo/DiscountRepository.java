package com.unleashed.repo;

import com.unleashed.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {


    Optional<Discount> findByDiscountCode(String discountCode);


    // Optional<Discount> findByCode(String code);

//    Page<Discount> findAllByDiscountStatus(DiscountStatus status, Pageable pageable);
//
//    @Query("SELECT d FROM Discount d WHERE " +
//            "(:status IS NULL OR d.discountStatus = :status) AND " +
//            "(:type IS NULL OR d.discountType = :type) AND " +
//            "(:minOrderValue IS NULL OR d.discountMinimumOrderValue <= :minOrderValue)")
//    List<Discount> filterDiscounts(@Param("status") DiscountStatus status,
//                                   @Param("type") DiscountType type,
//                                   @Param("minOrderValue") Double minOrderValue,
//                                   Pageable pageable);
//
//    @Query("SELECT d, ud.isDiscountUsed FROM Discount d " +
//            "LEFT JOIN UserDiscount ud ON d.id = ud.id.discountId " +
//            "WHERE ud.id.userId = :userId")
//    List<Object[]> findDiscountsWithUsageCountByUserId(@Param("userId") String userId);
}