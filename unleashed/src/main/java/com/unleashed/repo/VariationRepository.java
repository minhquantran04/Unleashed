package com.unleashed.repo;

import com.unleashed.entity.Variation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VariationRepository extends JpaRepository<Variation, Integer> {
//    @Query("SELECT v FROM Variation v WHERE v.product.productId = :productId")
@Query("""
    SELECT v 
    FROM Variation v 
    LEFT JOIN StockVariation sv ON sv.id.variationId = v.id 
    WHERE v.product.productId = :productId 
      AND (sv.stockQuantity IS NULL OR sv.stockQuantity <> -1)
""")


    List<Variation> findProductVariationByProductId(@Param("productId") String productId);

    Optional<Variation> findByProduct_ProductCodeAndColor_ColorNameAndSize_SizeName(String productCode, String colorName, String sizeName);

    @Query("SELECT v.product.productId FROM Variation v WHERE v.id = :variationId")
    String findProductIdByVariationId(@Param("variationId") int variationId);

    @Query("SELECT v FROM Variation v WHERE v.product.productId IN :productIds")
    List<Variation> findProductVariationsByProductIds(@Param("productIds") List<String> productIds);

    @Query("SELECT v.product.productId FROM Variation v WHERE v.id IN :variationIds")
    List<String> findProductIdsByVariationIds(@Param("variationIds") List<Integer> variationIds);

}
