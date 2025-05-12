package com.unleashed.repo;

import com.unleashed.dto.OrderStatusDTO;
import com.unleashed.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface StatisticsRepository extends JpaRepository<Order, String> { // Thay String bằng kiểu ID của Order nếu khác

    @Query(value = "SELECT SUM(order_total_amount) " +
            "FROM public.\"order\" " +
            "WHERE DATE(order_date) = CURRENT_DATE", nativeQuery = true)
    BigDecimal getDailyTotalRevenue();

    @Query(value = "SELECT DATE(order_date) as order_day, " +
            "SUM(order_total_amount) " +
            "FROM public.\"order\" " +
            "WHERE EXTRACT(MONTH FROM order_date) = :month " +
            "AND EXTRACT(YEAR FROM order_date) = :year " + // Thêm điều kiện WHERE với tham số tháng và năm
            "GROUP BY DATE(order_date) " +
            "ORDER BY DATE(order_date)", nativeQuery = true)
    List<Object[]> getMonthlyDailyRevenue(@Param("month") int month, @Param("year") int year); // Thêm tham số vào method

    @Query(value = "SELECT SUM(order_total_amount) " +
            "FROM public.\"order\" " +
            "WHERE EXTRACT(MONTH FROM order_date) = :month " +
            "AND EXTRACT(YEAR FROM order_date) = :year", nativeQuery = true)
        // Thêm điều kiện WHERE với tham số tháng và năm
    BigDecimal getMonthlyTotalRevenue(@Param("month") int month, @Param("year") int year); // Thêm tham số vào method

    @Query(value = "SELECT SUM(order_total_amount) " +
            "FROM public.\"order\" " +
            "WHERE EXTRACT(YEAR FROM order_date) = :year", nativeQuery = true)
    BigDecimal getYearlyTotalRevenue(@Param("year") int year); // Thêm tham số vào method

    @Query(value = "SELECT EXTRACT(MONTH FROM order_date) as order_month, SUM(order_total_amount) " +
            "FROM public.\"order\" " +
            "WHERE EXTRACT(YEAR FROM order_date) = :year " +
            "GROUP BY EXTRACT(MONTH FROM order_date) " +
            "ORDER BY EXTRACT(MONTH FROM order_date)", nativeQuery = true)
    List<Object[]> getYearlyMonthlyRevenue(@Param("year") int year); // Thêm tham số vào method

    @Query("SELECT new com.unleashed.dto.OrderStatusDTO(o.orderId, os.orderStatusName, o.orderCreatedAt) " +
            "FROM Order o " +
            "JOIN o.orderStatus os " +
            "ORDER BY os.id ASC, o.orderCreatedAt DESC")
        // Thêm ORDER BY clause vào query, sắp xếp mặc định
    Page<OrderStatusDTO> getOrderStatusList(Pageable pageable); // Thay List bằng Page và thêm Pageable parameter

    @Query(value = """
            WITH ProductSales AS (
                SELECT
                    p.product_name,
                    COUNT(ovs.variation_single_id) AS total_sold
                FROM
                    product p
                JOIN
                    variation_single vs ON SUBSTRING(vs.variation_single_code, 1, 6) = p.product_code -- Liên kết dựa trên 6 ký tự đầu của variation_single_code và product_code
                JOIN
                    order_variation_single ovs ON vs.variation_single_id = ovs.variation_single_id
                JOIN
                    "order" o ON ovs.order_id = o.order_id
                WHERE
                    o.order_date >= NOW() - INTERVAL '1 day' * :number_of_days
                  AND o.order_status_id IN (SELECT order_status_id from order_status)
                GROUP BY
                    p.product_name
            )
            SELECT
                product_name,
                total_sold
            FROM
                ProductSales
            ORDER BY
                total_sold DESC
            LIMIT :top_n_products
            """, nativeQuery = true)
    List<Object[]> findBestSellingProducts(@Param("number_of_days") int numberOfDays, @Param("top_n_products") int topNProducts);

    @Query(value = """
            WITH ProductSales AS (
                SELECT
                    p.product_name,
                    COUNT(ovs.variation_single_id) AS total_sold
                FROM
                    product p
                JOIN
                    variation_single vs ON SUBSTRING(vs.variation_single_code, 1, 6) = p.product_code
                JOIN
                    order_variation_single ovs ON vs.variation_single_id = ovs.variation_single_id
                JOIN
                    "order" o ON ovs.order_id = o.order_id
                WHERE
                    o.order_status_id IN (SELECT order_status_id from order_status)
                GROUP BY
                    p.product_name
            )
            SELECT
                product_name,
                total_sold
            FROM
                ProductSales
            ORDER BY
                total_sold DESC
            LIMIT :top_n_products
            """, nativeQuery = true)
    List<Object[]> findAllTimeBestSellingProducts(@Param("top_n_products") int topNProducts); // Query cho All Time

}