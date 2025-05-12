package com.unleashed.repo;

import com.unleashed.entity.ComposeKey.StockVariationId;
import com.unleashed.entity.StockVariation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockVariationRepository extends JpaRepository<StockVariation, StockVariationId> {

    //    @Query("SELECT sp FROM StockProduct sp JOIN FETCH sp.productVariation pv " +
//            "JOIN FETCH pv.product p " +
//            "JOIN FETCH p.category c " +
//            "JOIN FETCH p.brand b " +
//            "JOIN FETCH pv.size s " +
//            "JOIN FETCH pv.color co " +
//            "WHERE sp.stock.stockId = :stockId")
//    List<StockProduct> findAllByStockId(@Param("stockId") int stockId);
    @Query("SELECT sv FROM StockVariation sv WHERE sv.id.variationId = :variationId")
    List<StockVariation> findByVariationId(@Param("variationId") int variationId);

    //OLD - DON'T DELETE
//    @Query("SELECT SUM(sv.stockQuantity) FROM StockVariation sv join Variation v on sv.id.variationId = v.id join Stock s on s.id = sv.id.stockId WHERE sv.id.variationId = :variationId GROUP BY sv.id")
//    Integer findStockProductByProductVariationId(@Param("variationId") int variationId);

    @Query("SELECT SUM(sv.stockQuantity) FROM StockVariation sv WHERE sv.id.variationId = :variationId")
    Integer findStockProductByProductVariationId(@Param("variationId") int variationId);

    @Query("SELECT SUM(sv.stockQuantity) FROM StockVariation sv " +
            "JOIN Variation v ON sv.id.variationId = v.id " +
            "JOIN Product p ON v.product.productId = p.productId " +
            "WHERE p.productId = :productId")
    Integer getTotalStockQuantityForProduct(@Param("productId") String productId);
}


