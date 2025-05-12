package com.unleashed.repo;

import com.unleashed.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository


public interface OrderRepository extends JpaRepository<Order, String>, JpaSpecificationExecutor<Order> {

    @Query("SELECT o FROM Order o " +
            "LEFT JOIN FETCH o.user u " +
            "WHERE (:status IS NULL OR o.orderStatus = :status) " +
            "AND (:userId IS NULL OR o.user.userId = :userId) " +
            "ORDER BY o.orderDate DESC")
    Page<Order> findAllByStatusAndUserId(String status, String userId, Pageable pageable);


    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.orderDate DESC")
    Page<Order> findByUserId(@Param("userId") String userId, Pageable pageable);

    @Modifying
    @Query("UPDATE Order o SET o.orderStatus.orderStatusName = 'CANCELLED' WHERE o.orderId = :orderId")
    void updateOrderStatusToCancelled(@Param("orderId") String orderId);

    @Query("SELECT o FROM Order o left join User u on u.userUsername = o.user.userUsername WHERE u.userUsername = :username AND o.orderId = :orderId ")
    Optional<Order> findOrderByUserIdAndOrderId(String username, String orderId);

    //Statistics

    @Query("SELECT SUM(o.orderTotalAmount) FROM Order o WHERE o.orderStatus.orderStatusName = 'COMPLETED'")
    Double findTotalRevenue();

    @Query("SELECT o.orderDate, SUM(o.orderTotalAmount) FROM Order o WHERE o.orderStatus.orderStatusName = 'COMPLETED' GROUP BY o.orderDate ORDER BY o.orderDate ASC")
    List<Object[]> findDailyRevenue();

    @Query(value = """
            SELECT 
                YEAR(o.order_date) AS year,
                MONTH(o.order_date) AS month,
                SUM(o.total_amount) AS totalAmount
            FROM `order` o
            WHERE o.order_status = 'COMPLETED'
            GROUP BY YEAR(o.order_date), MONTH(o.order_date)
            ORDER BY year, month
            """, nativeQuery = true)
    List<Object[]> findMonthlyRevenue();


    @Query("SELECT o.orderStatus, COUNT(o) FROM Order o GROUP BY o.orderStatus")
    List<Object[]> findOrderStatusStatistics();

    @Query(value = """
            SELECT 
                pv.product_id AS productId,
                p.product_name AS productName,
                SUM(od.order_quantity) AS totalSold
            FROM order_variation_single od
            JOIN variation v ON od.variation_id = v.variation_id
            JOIN product p ON v.product_id = p.product_id
            GROUP BY v.product_id, p.product_name
            ORDER BY totalSold DESC
            """, nativeQuery = true)
    List<Object[]> findBestSellingProducts();

    @Query(value = """
            SELECT 
                p.product_id AS productId, 
                p.product_name AS productName, 
                SUM(od.order_quantity) AS totalQuantitySold
            FROM 
                `order` o
            JOIN 
                order_detail od ON o.order_id = od.order_id
            JOIN 
                product_variation pv ON od.variation_id = pv.variation_id    
            JOIN 
                product p ON pv.product_id = p.product_id
            WHERE 
                o.order_status = 'COMPLETED' AND DATE_FORMAT(o.order_date, '%Y-%m') = :month
            GROUP BY 
                p.product_id, p.product_name
            ORDER BY 
                totalQuantitySold DESC
            """, nativeQuery = true)
    List<Object[]> findBestSellingByMonth(@Param("month") String month);

    @Query(value = """
            SELECT 
                o.order_status AS orderStatus, 
                COUNT(o.order_id) AS totalOrders
            FROM 
                `order` o
            WHERE 
                DATE_FORMAT(o.order_date, '%Y-%m') = :month
            GROUP BY 
                o.order_status
            ORDER BY 
                totalOrders DESC
            """, nativeQuery = true)
    List<Object[]> findOrderStatusByMonth(@Param("month") String month);

    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.orderCreatedAt DESC")
    List<Order> findRecentOrdersByUserId(@Param("userId") String userId, Pageable pageable);

    @Query(value = """
            WITH ProductSales AS (
                SELECT
                    p.product_id,
                    COUNT(ovs.variation_single_id) AS total_sold
                FROM
                    product p
                JOIN
                    variation v ON p.product_id = v.product_id
                JOIN
                    variation_single vs ON v.variation_id = vs.variation_single_id
                JOIN
                    order_variation_single ovs ON vs.variation_single_id = ovs.variation_single_id
                JOIN
                    "order" o ON ovs.order_id = o.order_id
                WHERE
                    o.order_date >= NOW() - INTERVAL '1 day' * :number_of_days
                  AND o.order_status_id IN (SELECT order_status_id from order_status)
                GROUP BY
                    p.product_id
            )
            SELECT
                product_id
            FROM
                ProductSales
            ORDER BY
                total_sold DESC
            LIMIT :top_n_products
            """, nativeQuery = true)
    List<String> findTopSoldProductIds(@Param("number_of_days") int numberOfDays, @Param("top_n_products") int topNProducts);
}
