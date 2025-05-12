package com.unleashed.repo;

import com.unleashed.dto.WishlistDTO;
import com.unleashed.entity.ComposeKey.WishlistId;
import com.unleashed.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, WishlistId> {

    @Query("""
                SELECT new com.unleashed.dto.WishlistDTO(
                    w.id.userId,
                    p.productId,
                    p.productName,
                    (SELECT v.variationImage
                     FROM Variation v
                     WHERE v.product.productId = p.productId
                     ORDER BY v.id ASC
                     LIMIT 1)
                )
                FROM Wishlist w
                JOIN Product p ON w.id.productId = p.productId
                WHERE w.id.userId = :userId
            """)
    List<WishlistDTO> findWishlistByUserId(String userId);
}
