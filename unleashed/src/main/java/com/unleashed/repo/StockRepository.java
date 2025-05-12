package com.unleashed.repo;

import com.unleashed.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockRepository extends JpaRepository<Stock, Integer> {
    @Query(value = "SELECT DISTINCT ON (v.variation_id, s.stock_id) \n" +
            "    s.stock_id,\n" +
            "    s.stock_name,\n" +
            "    s.stock_address,\n" +
            "    v.variation_id,\n" +
            "    v.variation_price,\n" +
            "    v.variation_image,\n" +
            "    p.product_name,\n" +
            "    p.product_id,\n" +
            "    b.brand_id,\n" +
            "    b.brand_name,\n" +
            "    ct.category_id,\n" +
            "    ct.category_name,\n" +
            "    sz.size_name,\n" +
            "    cl.color_name,\n" +
            "    cl.color_hex_code,\n" +
            "    sv.stock_quantity\n" +
            "FROM\n" +
            "    public.stock s\n" +
            "LEFT JOIN public.stock_variation sv ON s.stock_id = sv.stock_id\n" +
            "LEFT JOIN public.variation v ON sv.variation_id = v.variation_id\n" +
            "LEFT JOIN public.product p ON v.product_id = p.product_id\n" +
            "LEFT JOIN public.brand b ON p.brand_id = b.brand_id\n" +
            "LEFT JOIN public.product_category pc ON p.product_id = pc.product_id\n" +
            "LEFT JOIN public.category ct ON pc.category_id = ct.category_id\n" +
            "LEFT JOIN public.size sz ON v.size_id = sz.size_id\n" +
            "LEFT JOIN public.color cl ON v.color_id = cl.color_id\n" +
            "WHERE s.stock_id = :stockId", nativeQuery = true)
    List<Object[]> findStockDetailsById(@Param("stockId") Integer stockId);
}