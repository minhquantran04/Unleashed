package com.unleashed.repo;

import com.unleashed.entity.UserDiscount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDiscountRepository extends JpaRepository<UserDiscount, Integer> {

    boolean existsById_UserIdAndId_DiscountId(String userId, Integer discountId);

    List<UserDiscount> findAllById_DiscountId(int discountId);


    List<UserDiscount> findAllById_UserId(String userId);


    Optional<UserDiscount> findById_UserIdAndId_DiscountId(String userId, Integer discountId);

    @Query("SELECT COUNT(ud) FROM UserDiscount ud WHERE ud.id.userId = :userId AND ud.id.discountId = :discountId")
    int countByUserIdAndDiscountId(@Param("userId") String userId, @Param("discountId") Integer discountId);

    @Query("SELECT COUNT(ud) FROM UserDiscount ud WHERE ud.id.discountId = :discountId")
    int countByDiscountId(@Param("discountId") Integer discountId);


}
