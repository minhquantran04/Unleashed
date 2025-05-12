package com.unleashed.repo;

import com.unleashed.entity.Cart;
import com.unleashed.entity.ComposeKey.CartId;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CartRepository extends CrudRepository<Cart, CartId> {
    List<Cart> findAllById_UserId(String idUserId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Cart c WHERE c.id.userId = :userId")
    void deleteAllById_UserId(String userId);
}
