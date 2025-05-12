package com.unleashed.service;

import com.unleashed.dto.*;
import com.unleashed.dto.mapper.ProductMapper;
import com.unleashed.entity.*;
import com.unleashed.repo.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final VariationRepository variationRepository;
    private final SizeRepository sizeRepository;
    private final ColorRepository colorRepository;
    private final SaleProductRepository saleProductRepository;
    private final ReviewRepository reviewRepository;
    private final StockVariationRepository stockVariationRepository; // Inject StockVariationRepository
    private final ProductStatusRepository productStatusRepository;
    private final SaleRepository saleRepository;
    private final ProductMapper productMapper;
    private final ReviewService reviewService;


    @Autowired
    public ProductService(ProductRepository productRepository, BrandRepository brandRepository, CategoryRepository categoryRepository, VariationRepository variationRepository, VariationRepository variationRepository1, SizeRepository sizeRepository, ColorRepository colorRepository, SaleProductRepository saleProductRepository, ReviewRepository reviewRepository, StockRepository stockRepository, StockVariationRepository stockVariationRepository, ProductStatusRepository productStatusRepository, SaleRepository saleRepository, ProductMapper productMapper, ReviewService reviewService) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
        this.variationRepository = variationRepository;
        this.sizeRepository = sizeRepository;
        this.colorRepository = colorRepository;
        this.saleProductRepository = saleProductRepository;
        this.reviewRepository = reviewRepository;
        this.stockVariationRepository = stockVariationRepository; // Initialize StockVariationRepository
        this.productStatusRepository = productStatusRepository;
        this.saleRepository = saleRepository;
        this.productMapper = productMapper;
        this.reviewService = reviewService;
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findById(String id) {
        //THIS ONE IS USED TO FIND ALL VARIATIONS THAT BELONGS TO A PRODUCT
        //TO WHO THE F NAMED THESE, F YOU

//        System.out.println("ProductService.findById() is called for productId: " + id);
//        Product pro = new Product();
//        pro = productRepository.findProductWithVariations(id);
//        pro.getProductVariations().forEach(pv -> System.out.println("For ID " + id + " result is: " + pv.getColor()));
//        return productRepository.findProductWithVariations(id);
        // OLD CODE:
        //Optional<Product> pro = productRepository.findById(id);




        return productRepository.findById(id).orElse(null);
    }


    public ProductItemDTO findProductItemById(String id) {
        ProductItemDTO productItemDTO = new ProductItemDTO();
        Optional<Product> productOptional = productRepository.findById(id);
        SaleProduct saleProduct = saleProductRepository.findSaleProductByProductId(id);

        // Lấy danh sách review (SỬA ĐỂ LẤY REVIEWS CÓ COMMENT CON)
        List<ProductReviewDTO> productReviewDTOList = reviewService.getAllReviewsByProductId(id); // **SỬA ĐÂY: Gọi reviewService.getAllReviewsByProductId**

        // Lấy tổng rating và trung bình rating
        List<Object[]> totalRating = reviewRepository.countAndAvgRatingByProductId(id);

        // Lấy danh sách variation của sản phẩm
        List<Variation> productVariations = variationRepository.findProductVariationByProductId(id);
        List<ProductVariationDTO> productVariationDTOList = new ArrayList<>();
        for (Variation variation : productVariations) {
            ProductVariationDTO productVariationDTO = new ProductVariationDTO();
            productVariationDTO.setId(variation.getId());
            productVariationDTO.setPrice(variation.getVariationPrice());
            productVariationDTO.setImages(variation.getVariationImage());
            productVariationDTOList.add(productVariationDTO);
        }

        // Lấy danh sách size và color
        List<Size> sizes = sizeRepository.findAllByProductId(id);
        List<Color> colors = colorRepository.findAllByProductId(id);

        // Xây dựng map variations theo cấu trúc: {colorName -> {sizeName -> ProductVariationDTO}}
        Map<String, Map<String, ProductVariationDTO>> variations = new HashMap<>();

        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            // Lấy status từ bảng product_status
            Integer status = productStatusRepository.findStatusByProductId(id);
            productItemDTO.setStatus(status != null ? status : 5); // Nếu không có thì mặc định là 5 (NEW)

            // Xây dựng map variations
            for (Color color : colors) {
                Map<String, ProductVariationDTO> sizeMap = new HashMap<>();
                for (Size size : sizes) {
                    productVariations.stream()
                            .filter(variation -> variation.getColor().equals(color) && variation.getSize().equals(size))
                            .findFirst()
                            .ifPresent(variation -> {
                                ProductVariationDTO productVariationDTO = new ProductVariationDTO();
                                productVariationDTO.setId(variation.getId());
                                productVariationDTO.setPrice(variation.getVariationPrice());
                                productVariationDTO.setImages(variation.getVariationImage());

                                // Lấy số lượng stock cho variation, nếu null thì gán mặc định 0
                                Integer stockProduct = stockVariationRepository.findStockProductByProductVariationId(variation.getId()); //THIS LINE
                                productVariationDTO.setQuantity(stockProduct != null ? stockProduct : 0);

                                sizeMap.put(size.getSizeName(), productVariationDTO);
                            });
                }
                variations.put(color.getColorName(), sizeMap);
            }

            // Cập nhật thông tin sản phẩm
            productItemDTO.setProductId(id);
            productItemDTO.setProductName(product.getProductName());
            productItemDTO.setDescription(product.getProductDescription());

            if (product.getBrand() != null) {
                productItemDTO.setBrand(product.getBrand());
            }

            productItemDTO.setCategories(product.getCategories());

            // Xử lý sale nếu có
            if (saleProduct != null) {
                Sale sale = saleRepository.findById(saleProduct.getId().getSaleId()).orElse(null);
                if (sale != null && sale.getSaleType() != null) {
                    productItemDTO.setSaleType(sale.getSaleType());
                    productItemDTO.setSaleValue(sale.getSaleValue());
                }
            }

            productItemDTO.setReviews(productReviewDTOList);

            // Thiết lập tổng rating và trung bình rating nếu có dữ liệu
            if (totalRating != null && !totalRating.isEmpty()) {
                for (Object[] result : totalRating) {
                    productItemDTO.setTotalRating((long) result[0]);
                    productItemDTO.setAvgRating((double) result[1]);
                }
            }

            productItemDTO.setSizes(sizes);
            productItemDTO.setColors(colors);
            productItemDTO.setVariations(variations);
        }
        //System.out.println("product" + productItemDTO);
        return productItemDTO;
    }


    @Transactional
    public void deleteProduct(String id) {
        productRepository.softDeleteProduct(id);
    }

    @Transactional
    public Product addProduct(ProductDTO productDTO) {
        Product product = new Product();


        //System.out.println(productDTO);

        product.setProductName(productDTO.getProductName());
        product.setProductDescription(productDTO.getProductDescription());

        product.setProductStatus(productStatusRepository.findById(2).orElse(null));

        product.setBrand(brandRepository.findById(productDTO.getBrandId()).orElse(null));
        product = productRepository.save(product);
        for (Integer categoryId : productDTO.getCategoryIdList()) {
            productRepository.addProductCategory(product.getProductId(), categoryId);
        }
//        System.out.println(productRepository);
        List<Variation> variations = new ArrayList<>();
        Set<String> uniqueVariations = new HashSet<>(); // Lưu key duy nhất của size và color

        for (ProductDTO.ProductVariationDTO variationDTO : productDTO.getVariations()) {
            String key = variationDTO.getSizeId() + "-" + variationDTO.getColorId(); // Tạo key duy nhất

            if (!uniqueVariations.contains(key)) { // Nếu chưa có thì thêm vào
                Variation variation = new Variation();
                variation.setSize(sizeRepository.findById(variationDTO.getSizeId()).orElse(null));
                variation.setColor(colorRepository.findById(variationDTO.getColorId()).orElse(null));
                variation.setVariationPrice(variationDTO.getProductPrice());
                variation.setVariationImage(variationDTO.getProductVariationImage());
                variation.setProduct(product);

                variations.add(variation);
                uniqueVariations.add(key); // Đánh dấu đã có
            }
        }


        // Save all ProductVariations to the database
        variationRepository.saveAll(variations);

        // Associate the variations with the product
//         savedProduct.setProductVariations(variations);

        return product;
    }


    @Transactional
    public Product updateProduct(ProductDTO productDTO, String id) {
        Optional<Product> existingProduct = productRepository.findById(id);

        if (existingProduct.isPresent()) {
            Product product = existingProduct.get();
            product.setProductDescription(productDTO.getProductDescription());
            product.setProductName(productDTO.getProductName());
            product.setProductStatus(productDTO.getProductStatusId());
            product.setBrand(brandRepository.findById(productDTO.getBrandId()).orElse(null));
            List<Integer> categoryIdList = productDTO.getCategoryIdList();
            List<Category> categories = categoryIdList.stream()
                    .map(catId -> categoryRepository.findById(catId)
                            .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + catId)))
                    .collect(Collectors.toList());

            product.setCategories(categories);

            return productRepository.save(product);
        } else {
            return null;
        }
    }

    public List<ProductListDTO> getListProduct() {
        List<Product> result = productRepository.findAllActiveProducts();
        List<ProductListDTO> productList = new ArrayList<>();

        for (Product product : result) { // Iterate over Product entities directly

            String productId = product.getProductId();

            boolean exists = productList.stream()
                    .anyMatch(dto -> dto.getProductId().equals(productId));

            //deleted == skip
            if (product.getProductStatus() == null) {
                continue;
            }


            if (!exists && !product.getProductVariations().isEmpty()) {
                ProductListDTO productListDTO = new ProductListDTO();
                productListDTO.setProductId(productId);
                productListDTO.setProductName(product.getProductName());
                productListDTO.setProductDescription(product.getProductDescription());
                productListDTO.setBrandId(product.getBrand().getId());
                productListDTO.setBrandName(product.getBrand().getBrandName());
                productListDTO.setCategoryList(new ArrayList<>(product.getCategories())); // Get categories

                // Get first variation for price and image
                List<Variation> variations = variationRepository.findProductVariationByProductId(productId);
                if (!variations.isEmpty()) {
                    Variation firstVariation = variations.get(0);
                    productListDTO.setProductPrice(firstVariation.getVariationPrice());
                    productListDTO.setProductVariationImage(firstVariation.getVariationImage());
                }

                // Get Sale information
                List<SaleProduct> saleProduct = saleProductRepository.findById_ProductId(productId);
                if (saleProduct != null && !saleProduct.isEmpty()) {
                    saleProduct.forEach(sp -> {
                        Sale sale = saleRepository.findById(sp.getId().getSaleId()).orElse(null);
                        if (sale != null && Objects.equals(sale.getSaleStatus().getSaleStatusName(), "ACTIVE")) {
                            productListDTO.setSale(sale); // Set the entire Sale object if needed
                            productListDTO.setSaleValue(sale.getSaleValue()); // Or just the saleValue
                        }
                    });

                }

                // Get average rating and total ratings
                List<Object[]> ratingData = reviewRepository.countAndAvgRatingByProductId(productId);
                if (!ratingData.isEmpty() && ratingData.get(0) != null) { // Check for null and empty
                    Object[] ratingResult = ratingData.get(0);
                    productListDTO.setTotalRatings((Long) ratingResult[0]);
                    productListDTO.setAverageRating((Double.parseDouble(String.format("%.2f",(Double) ratingResult[1]))));
                } else {
                    productListDTO.setTotalRatings(0L); // Default to 0 if no ratings
                    productListDTO.setAverageRating(0.0); // Default to 0.0 if no ratings
                }


                // Calculate total quantity for the product (already implemented)
                Integer totalQuantity = stockVariationRepository.getTotalStockQuantityForProduct(productId);
                productListDTO.setQuantity(totalQuantity != null ? totalQuantity : 0);

                productList.add(productListDTO);
            }
        }

        return productList;
    }

    @Transactional
    public Product addVariationsToExistingProduct(String productId, List<ProductDTO.ProductVariationDTO> variationDTOs) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<Variation> existingVariations = product.getProductVariations(); // Lấy danh sách biến thể hiện có
        List<Variation> newVariations = new ArrayList<>();

        for (ProductDTO.ProductVariationDTO variationDTO : variationDTOs) {
            Size size = sizeRepository.findById(variationDTO.getSizeId()).orElse(null);
            Color color = colorRepository.findById(variationDTO.getColorId()).orElse(null);

            // Kiểm tra xem biến thể đã tồn tại chưa
            boolean exists = existingVariations.stream().anyMatch(v ->
                    v.getSize().equals(size) && v.getColor().equals(color)
            );

            if (!exists) {
                Variation variation = new Variation();
                variation.setSize(size);
                variation.setColor(color);
                variation.setVariationPrice(variationDTO.getProductPrice());
                variation.setVariationImage(variationDTO.getProductVariationImage());
                variation.setProduct(product);
                newVariations.add(variation);
            }
        }

        // Chỉ lưu các biến thể mới vào cơ sở dữ liệu
        if (!newVariations.isEmpty()) {
            variationRepository.saveAll(newVariations);
            product.getProductVariations().addAll(newVariations);
            return productRepository.save(product);
        }

        return product;
    }

    public Page<ProductListDTO> searchProducts(String query, Pageable pageable) { // Return Page<ProductListDTO>
        Page<Object[]> productPageResult = productRepository.searchProducts(query, pageable);
        return productPageResult.map(result -> {
            Product product = (Product) result[0];
            Variation firstVariation = (Variation) result[1];
            Double averageRating = (Double) result[2]; // Lấy averageRating từ result array
            Long totalRatings = (Long) result[3];   // Lấy totalRatings từ result array

            ProductListDTO productListDTO = new ProductListDTO(); // **Tạo ProductListDTO mới thủ công**
            // Map các fields từ Product entity vào ProductListDTO (bằng tay hoặc dùng mapper)
            productListDTO.setProductId(product.getProductId());
            productListDTO.setProductName(product.getProductName());
            productListDTO.setProductDescription(product.getProductDescription());

            if (firstVariation != null) {
                productListDTO.setProductPrice(firstVariation.getVariationPrice());
                productListDTO.setProductVariationImage(firstVariation.getVariationImage());
            } else {
                productListDTO.setProductPrice(BigDecimal.ZERO);
                productListDTO.setProductVariationImage(null);
            }
            productListDTO.setAverageRating(averageRating != null ? averageRating : 0.0); // Set averageRating từ query result
            productListDTO.setTotalRatings(totalRatings != null ? totalRatings : 0L);   // Set totalRatings từ query result
            return productListDTO;
        });
    }

    public List<ProductDetailDTO> getProductsInStock() {
        List<Product> products = productRepository.findProductsInStock();
        List<String> productIdsInSale = saleProductRepository.findAllProductIdsInSale(); // Lấy danh sách productId đang trong sale
        return products.stream()
                .filter(product -> !productIdsInSale.contains(product.getProductId()))
                .map(product -> ProductDetailDTO.builder()
                        .productId(product.getProductId())
                        .productName(product.getProductName())
                        .productCode(product.getProductCode())
                        .productDescription(product.getProductDescription())
                        .productCreatedAt(product.getProductCreatedAt())
                        .productUpdatedAt(product.getProductUpdatedAt())
                        .brand(product.getBrand())
                        .productStatusId(product.getProductStatus())
                        .categories(product.getCategories())
                        .productVariations(product.getProductVariations())
                        .build())
                .collect(Collectors.toList());
    }

}
