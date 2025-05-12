package com.unleashed.repo;

import com.unleashed.entity.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Integer> {
    List<Sale> findAllByOrderByIdDesc();

    @Query("SELECT  s FROM Sale s " +
            "JOIN SaleProduct sp ON s.id = sp.id.saleId " +
            "JOIN Product  p ON p.productId = sp.id.productId " +
            "WHERE sp.id.productId = :productId AND s.saleStatus.id = 2")
    Optional<Sale> findSaleByProductId(@Param("productId") String productId);
}
