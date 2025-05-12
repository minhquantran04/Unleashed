package com.unleashed.dto;

import com.unleashed.entity.Category;
import com.unleashed.entity.Sale;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductListDTO {
    private String productId;
    private String productName;
    private String productDescription;
    private int brandId;
    private String brandName;
    private List<Category> categoryList;
    private String productVariationImage;
    private BigDecimal productPrice;
    private Sale sale;
    private BigDecimal saleValue;
    private Double averageRating;
    private Long totalRatings;
    private int quantity;
}
