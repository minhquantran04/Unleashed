package com.unleashed.repo;

import com.unleashed.entity.Brand;
import com.unleashed.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {


    @Query("SELECT p.productName FROM Product p left join Variation v on p.productId = v.product.productId WHERE v.id = :variationId")
    String getProductNameById(@Param("variationId") Integer variationId);

//    @Query(value = "SELECT " +
//            "    months.month, " +
//            "    IFNULL(SUM(od.order_quantity * (od.unit_price - od.discount_amount)), 0) AS total_revenue " +
//            "FROM " +
//            "    (SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL n MONTH), '%Y-%m') AS month " +
//            "     FROM (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION " +
//            "                  SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION " +
//            "                  SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11) AS months " +
//            "    ) months " +
//            "LEFT JOIN " +
//            "    order o ON DATE_FORMAT(o.order_date, '%Y-%m') = months.month " +
//            "LEFT JOIN " +
//            "    order_detail od ON o.order_id = od.order_id AND o.order_status = 'COMPLETED' " +
//            "GROUP BY " +
//            "    months.month " +
//            "ORDER BY " +
//            "    months.month", nativeQuery = true)
//    List<Object[]> findTotalRevenuePerMonth();

    boolean existsByBrand(Brand brand);

    boolean existsByCategories_Id(int categoryId);


    @Modifying
    @Query("UPDATE Product p SET p.productStatus.id = null WHERE p.productId = :id")
    void softDeleteProduct(@Param("id") String id);


    @Modifying
    @Query(value = "INSERT INTO product_category (product_id, category_id) VALUES (:productId, :categoryId)", nativeQuery = true)
    void addProductCategory(@Param("productId") String productId, @Param("categoryId") Integer categoryId);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.productVariations WHERE p.productId = :productId")
    Product findProductWithVariations(@Param("productId") String productId);

//    @Query("""
//        SELECT p, v FROM Product p
//        LEFT JOIN Variation v ON p.productId = v.product.productId
//        WHERE LOWER(p.productName) LIKE LOWER(concat('%', :query, '%'))
//           OR LOWER(p.productCode) LIKE LOWER(concat('%', :query, '%'))
//           OR LOWER(p.productDescription) LIKE LOWER(concat('%', :query, '%'))
//        ORDER BY v.id ASC
//        """)
//    Page<Object[]> searchProducts(@Param("query") String query, Pageable pageable);

    @Query(value = """
            SELECT p, v,
                   COALESCE(AVG(r.reviewRating), 0) AS averageRating,
                   COUNT(r.reviewRating) AS totalRatings
            FROM Product p
            LEFT JOIN Variation v
                ON v.id = (
                    SELECT v2.id
                    FROM Variation v2
                    WHERE v2.product.productId = p.productId
                    ORDER BY v2.id ASC
                    LIMIT 1
                )
            LEFT JOIN Review r ON p.productId = r.product.productId
            WHERE LOWER(p.productName) LIKE LOWER(concat('%', :query, '%'))
               OR LOWER(p.productCode) LIKE LOWER(concat('%', :query, '%'))
               OR LOWER(p.productDescription) LIKE LOWER(concat('%', :query, '%'))
            GROUP BY p, v
            ORDER BY p.productId ASC
            """,
            countQuery = """
                    SELECT COUNT(DISTINCT p.productId)
                    FROM Product p
                    WHERE LOWER(p.productName) LIKE LOWER(concat('%', :query, '%'))
                       OR LOWER(p.productCode) LIKE LOWER(concat('%', :query, '%'))
                       OR LOWER(p.productDescription) LIKE LOWER(concat('%', :query, '%'))
                    """)
    Page<Object[]> searchProducts(@Param("query") String query, Pageable pageable);

    List<Product> findByProductIdIn(List<String> productIds);

    @Query("SELECT p.productId FROM Product p WHERE p.productCode = :productCode")
    String findIdByProductCode(@Param("productCode") String productCode);

    @Query("""
                SELECT DISTINCT p FROM Product p
                JOIN FETCH p.productVariations v
                JOIN StockVariation sv ON sv.id.variationId = v.id
                WHERE sv.stockQuantity > 0
            """)
    List<Product> findProductsInStock();

    @Query("SELECT p.productId FROM Product p WHERE p.productCode IN :productCodes")
    List<String> findIdsByProductCodes(@Param("productCodes") List<String> productCodes);


    @Query("SELECT p FROM Product p WHERE p.productId IN :productIds")
    List<Product> findProductsByIds(@Param("productIds") List<String> productIds);

    @Query("SELECT p FROM Product p WHERE p.productStatus IS NOT NULL")
    List<Product> findAllActiveProducts();

    @Query("SELECT p.productName FROM Product p WHERE p.productCode = :productCode")
    Optional<String> findByProductCode(@Param("productCode") String productCode);


}
