package com.unleashed.repo;

import com.unleashed.entity.ComposeKey.OrderVariationSingleId;
import com.unleashed.entity.OrderVariationSingle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderVariationSingleRepository extends JpaRepository<OrderVariationSingle, OrderVariationSingleId> {
    List<OrderVariationSingle> findById_OrderId(String orderId);

    // this is useful
    @Query("SELECT ovs FROM OrderVariationSingle ovs WHERE ovs.order.user.userId = :userId")
    List<OrderVariationSingle> findByUserUserId(@Param("userId") String userId);

    List<OrderVariationSingle> findById_OrderIdIn(List<String> orderIds);
}