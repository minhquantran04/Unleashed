package com.unleashed.service;

import com.unleashed.config.RecommendationConfig;
import com.unleashed.dto.CartAnalysisDTO;
import com.unleashed.dto.ProductDTO;
import com.unleashed.dto.PurchaseAnalysisDTO;
import com.unleashed.dto.ScoredProductDTO;
import com.unleashed.entity.*;
import com.unleashed.repo.*;
import com.unleashed.util.StringSimilarityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ProductRecommendationService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderVariationSingleRepository orderVariationSingleRepository;
    private final SaleProductRepository saleProductRepository;
    private final DiscountRepository discountRepository;
    private final StockVariationRepository stockVariationRepository;
    private final UserDiscountRepository userDiscountRepository;
    private final UserRepository userRepository;
    private final VariationRepository variationRepository;
    private final CartRepository cartRepository;
    private final SaleRepository saleRepository;

    @Autowired
    public ProductRecommendationService(
            ProductRepository productRepository,
            OrderRepository orderRepository,
            OrderVariationSingleRepository orderVariationSingleRepository,
            SaleProductRepository saleProductRepository,
            DiscountRepository discountRepository,
            StockVariationRepository stockVariationRepository,
            UserDiscountRepository userDiscountRepository,
            UserRepository userRepository,
            VariationRepository variationRepository,
            CartRepository cartRepository,
            SaleRepository saleRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.orderVariationSingleRepository = orderVariationSingleRepository;
        this.saleProductRepository = saleProductRepository;
        this.discountRepository = discountRepository;
        this.stockVariationRepository = stockVariationRepository;
        this.userDiscountRepository = userDiscountRepository;
        this.userRepository = userRepository;
        this.variationRepository = variationRepository;
        this.cartRepository = cartRepository;
        this.saleRepository = saleRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getRecommendedProducts(String username,
                                                   String currentProductId) {

        Product currentProduct = productRepository.findById(currentProductId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + currentProductId));
        String currentProductName = currentProduct.getProductName();

        if (username == null || "null".equalsIgnoreCase(username) || username.isEmpty()) {
            return getSimilarProducts(currentProductId);
        }

        User user = userRepository.findByUserUsername(username).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found with username: " + username);
        }
        String userId = user.getUserId();

        List<Product> allProducts = productRepository.findAll();
        Map<String, Product> productMap = allProducts.stream().collect(Collectors.toMap(Product::getProductId, Function.identity()));

        allProducts.removeIf(p -> p.getProductId().equals(currentProductId));

        List<String> recentPurchaseProductIds = getRecentPurchaseProductIds(userId);

        if (recentPurchaseProductIds.isEmpty()) {
            return getSimilarProducts(currentProductId);
        }

        PurchaseAnalysisDTO purchaseAnalysis = analyzePurchases(recentPurchaseProductIds, productMap);
        CartAnalysisDTO cartAnalysis = analyzeCarts(userId, productMap);

        List<SaleProduct> saleProducts = saleProductRepository.findAll();
        Set<String> saleProductIds = saleProducts.stream()
                .map(saleProduct -> saleProduct.getId().getProductId())
                .collect(Collectors.toSet());

        Map<String, Long> productStockMap = allProducts.stream()
                .collect(Collectors.toMap(
                        Product::getProductId,
                        product -> Long.valueOf(Optional.ofNullable(stockVariationRepository.getTotalStockQuantityForProduct(product.getProductId())).orElse(0))
                ));

        List<UserDiscount> allUserDiscounts = userDiscountRepository.findAll();
        Map<String, List<UserDiscount>> userDiscountsMap = allUserDiscounts.stream()
                .collect(Collectors.groupingBy(ud -> ud.getId().getUserId()));

        List<Discount> allDiscounts = discountRepository.findAll();
        Map<Integer, Discount> discountMap = allDiscounts.stream()
                .collect(Collectors.toMap(Discount::getDiscountId, Function.identity()));

        List<String> topSoldProductIds = orderRepository.findTopSoldProductIds(RecommendationConfig.TRENDING_DAYS_WINDOW, RecommendationConfig.MAX_TRENDING_PRODUCTS);

        List<ScoredProductDTO> scoredProducts = allProducts.stream()
                .map(product -> {
                    double score = calculateRecommendationScore(product, purchaseAnalysis, userId, cartAnalysis, saleProductIds, productStockMap, userDiscountsMap, discountMap, topSoldProductIds, currentProductName);
                    BigDecimal representativePrice = getRepresentativePrice(product);
                    double priceDifference = (purchaseAnalysis != null && representativePrice != null)
                            ? Math.abs(representativePrice.doubleValue() - purchaseAnalysis.getAveragePrice())
                            : Double.MAX_VALUE;
                    return new ScoredProductDTO(product, score, priceDifference);
                })
                .filter(scoredProduct -> scoredProduct.getScore() > RecommendationConfig.MINIMUM_RECOMMENDATION_SCORE)
                .filter(scoredProduct -> productStockMap.getOrDefault(scoredProduct.getProduct().getProductId(), 0L) > 0)
                .collect(Collectors.toList());

        List<Product> finalRecommendations = sortAndLimitRecommendations(scoredProducts);

        if (RecommendationConfig.RESULT_SHOULD_HAVE_NON_RELATED) {
            List<Product> nonRelatedProducts = allProducts.stream()
                    .filter(product -> !finalRecommendations.contains(product))
                    .filter(product -> productStockMap.getOrDefault(product.getProductId(), 0L) > 0)
                    .limit(RecommendationConfig.MAX_RESULT_NON_RELATED_PRODUCTS)
                    .toList();
            finalRecommendations.addAll(nonRelatedProducts);
        }

        return getProductsWithDetails(finalRecommendations, productMap, productStockMap);

    }

    private List<String> getRecentPurchaseProductIds(String userId) {
        Pageable recentOrdersPageable = PageRequest.of(0, RecommendationConfig.MAX_RECENT_ORDERS_TO_CONSIDER);
        List<Order> recentOrders = orderRepository.findRecentOrdersByUserId(userId, recentOrdersPageable);

        List<String> orderIds = recentOrders.stream().map(Order::getOrderId).toList();
        List<OrderVariationSingle> orderVariationSingles = orderVariationSingleRepository.findById_OrderIdIn(orderIds);

        Set<String> productCodes = new HashSet<>();
        for (OrderVariationSingle orderVariationSingle : orderVariationSingles) {
            if (orderVariationSingle != null) {
                String variationSingleCode = orderVariationSingle.getVariationSingle().getVariationSingleCode();
                String productCode = variationSingleCode.substring(0, 6);
                productCodes.add(productCode);
            }
        }

        List<String> fetchedProductIds = productRepository.findIdsByProductCodes(new ArrayList<>(productCodes));
        return new ArrayList<>(new HashSet<>(fetchedProductIds));
    }


    private PurchaseAnalysisDTO analyzePurchases(List<String> recentPurchaseProductIds,
                                                 Map<String, Product> productMap) {
        PurchaseAnalysisDTO analysis = new PurchaseAnalysisDTO();
        Map<String, Integer> sizeCounts = new HashMap<>();
        Map<String, Integer> brandCounts = new HashMap<>();
        Map<String, Integer> categoryCounts = new HashMap<>();
        analysis.setMinPrice(Double.MAX_VALUE);
        analysis.setMaxPrice(Double.MIN_VALUE);
        double totalPrice = 0;

        List<Product> purchasedProducts = recentPurchaseProductIds.stream()
                .map(productMap::get)
                .filter(Objects::nonNull)
                .toList();

        analysis.setPurchasedProducts(purchasedProducts);

        if (purchasedProducts.isEmpty()) {
            return null;
        }

        for (Product product : purchasedProducts) {
            if (product.getProductVariations() != null) {
                for (Variation variation : product.getProductVariations()) {
                    if (variation.getSize() != null) {
                        sizeCounts.merge(variation.getSize().getSizeName(), 1, Integer::sum);
                    }
                }
            }
            if (product.getBrand() != null) {
                brandCounts.merge(product.getBrand().getBrandName(), 1, Integer::sum);
            }

            if (product.getCategories() != null) {
                for (Category category : product.getCategories()) {
                    categoryCounts.merge(category.getCategoryName(), 1, Integer::sum);
                }
            }

            if (product.getProductVariations() != null) {
                totalPrice += product.getProductVariations().stream()
                        .map(Variation::getVariationPrice)
                        .filter(Objects::nonNull)
                        .mapToDouble(BigDecimal::doubleValue)
                        .sum();
                product.getProductVariations().stream()
                        .map(Variation::getVariationPrice)
                        .filter(Objects::nonNull)
                        .mapToDouble(BigDecimal::doubleValue)
                        .min()
                        .ifPresent(analysis::setMinPrice);
                product.getProductVariations().stream()
                        .map(Variation::getVariationPrice)
                        .filter(Objects::nonNull)
                        .mapToDouble(BigDecimal::doubleValue)
                        .max()
                        .ifPresent(analysis::setMaxPrice);
            }
        }

        analysis.setMostFrequentSize(sizeCounts.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null));
        analysis.setMostFrequentBrand(brandCounts.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null));
        analysis.setMostFrequentCategory(categoryCounts.entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null));
        analysis.setAveragePrice(totalPrice / purchasedProducts.stream()
                .mapToDouble(p -> p.getProductVariations().size())
                .sum());
        analysis.setPriceRangeMin(analysis.getMinPrice() * (1 - RecommendationConfig.PRICE_RANGE_EXPANSION_FACTOR));
        analysis.setPriceRangeMax(analysis.getMaxPrice() * (1 + RecommendationConfig.PRICE_RANGE_EXPANSION_FACTOR));

        return analysis;
    }

    private CartAnalysisDTO analyzeCarts(String userId,
                                         Map<String, Product> productMap) {
        CartAnalysisDTO analysis = new CartAnalysisDTO();
        Map<String, Integer> productCounts = new HashMap<>();
        Map<String, Integer> productQuantities = new HashMap<>();
        List<Cart> carts = cartRepository.findAllById_UserId(userId);

        if (carts.isEmpty()) {
            return null;
        }

        List<Integer> variationIds = carts.stream()
                .filter(cart -> cart != null && cart.getId().getVariationId() != null)
                .map(cart -> cart.getId().getVariationId())
                .collect(Collectors.toList());


        List<String> productIds = variationRepository.findProductIdsByVariationIds(variationIds);

        Map<Integer, String> variationProductMap = new HashMap<>();
        for (int i = 0; i < variationIds.size() && i < productIds.size(); i++) {
            variationProductMap.put(variationIds.get(i), productIds.get(i));
        }

        for (Cart cart : carts) {
            if (cart != null && cart.getId().getVariationId() != null) {
                int variationId = cart.getId().getVariationId();
                String productId = variationProductMap.get(variationId);
                Product product = productMap.get(productId);

                if (product != null) {
                    String productName = product.getProductName();
                    int quantity = cart.getCartQuantity();

                    productCounts.merge(productName, 1, Integer::sum);
                    productQuantities.merge(productName, quantity, Integer::sum);
                }
            }
        }

        Optional<Map.Entry<String, Integer>> maxFrequencyEntry = productCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        Product mostFrequentProduct = maxFrequencyEntry.map(stringIntegerEntry -> findRandomProductByName(stringIntegerEntry.getKey(), productMap)).orElse(null);

        Optional<Map.Entry<String, Integer>> maxQuantityEntry = productQuantities.entrySet().stream()
                .max(Map.Entry.comparingByValue());

        Product highestQuantityProduct = maxQuantityEntry.map(stringIntegerEntry -> findRandomProductByName(stringIntegerEntry.getKey(), productMap)).orElse(null);

        if (mostFrequentProduct != null && mostFrequentProduct.equals(highestQuantityProduct) && productQuantities.size() > 1) {
            Optional<Map.Entry<String, Integer>> secondMaxQuantityEntry = productQuantities.entrySet().stream()
                    .filter(entry -> !entry.getKey().equals(mostFrequentProduct.getProductName()))
                    .max(Map.Entry.comparingByValue());
            highestQuantityProduct = secondMaxQuantityEntry.map(stringIntegerEntry -> findRandomProductByName(stringIntegerEntry.getKey(), productMap)).orElse(null);
        }

        analysis.setMostFrequentProduct(mostFrequentProduct);
        analysis.setHighestQuantityProduct(highestQuantityProduct);

        return analysis;
    }

    private Product findRandomProductByName(String productName,
                                            Map<String, Product> productMap) {
        return productMap.values().stream()
                .filter(p -> p.getProductName().equals(productName))
                .findAny()
                .orElse(null);
    }

    private double calculateRecommendationScore(Product product,
                                                PurchaseAnalysisDTO purchaseAnalysis,
                                                String userId,
                                                CartAnalysisDTO cartAnalysis,
                                                Set<String> saleProductIds,
                                                Map<String, Long> productStockMap,
                                                Map<String, List<UserDiscount>> userDiscountsMap,
                                                Map<Integer, Discount> discountMap,
                                                List<String> topSoldProductIds,
                                                String currentProductName) {
        double score = 0;

        if (product == null || product.getProductVariations() == null || productStockMap.getOrDefault(product.getProductId(), 0L) <= 0) {
            return 0;
        }

        if (purchaseAnalysis != null) {
            if (product.getProductVariations().stream()
                    .anyMatch(variation -> variation.getSize() != null && variation.getSize().getSizeName().equals(purchaseAnalysis.getMostFrequentSize()))) {
                score += RecommendationConfig.SCORE_WEIGHT_SIZE;
            }

            if (product.getBrand() != null && product.getBrand().getBrandName().equals(purchaseAnalysis.getMostFrequentBrand())) {
                score += RecommendationConfig.SCORE_WEIGHT_BRAND;
            }

            if (product.getCategories() != null && !product.getCategories().isEmpty() && purchaseAnalysis.getMostFrequentCategory() != null
                    && product.getCategories().stream().anyMatch(category -> category.getCategoryName().equals(purchaseAnalysis.getMostFrequentCategory()))) {
                score += RecommendationConfig.SCORE_WEIGHT_CATEGORY;
            }

            BigDecimal representativePrice = getRepresentativePrice(product);
            if (representativePrice != null && representativePrice.doubleValue() >= purchaseAnalysis.getPriceRangeMin() && representativePrice.doubleValue() <= purchaseAnalysis.getPriceRangeMax()) {
                score += RecommendationConfig.SCORE_WEIGHT_PRICE;
            }

            if (purchaseAnalysis.getPurchasedProducts() != null && !product.getProductVariations().isEmpty()
                    && purchaseAnalysis.getPurchasedProducts().stream().anyMatch(purchasedProduct ->
                    purchasedProduct.getProductVariations() != null && purchasedProduct.getProductVariations().stream().anyMatch(purchasedVariation ->
                            product.getProductVariations().stream().anyMatch(productVariation ->
                                    productVariation.getColor() != null && purchasedVariation.getColor() != null
                                            && productVariation.getColor().getColorName().equals(purchasedVariation.getColor().getColorName())
                            )
                    )
            )) {
                score += RecommendationConfig.SCORE_WEIGHT_COLOR;
            }

            if (saleProductIds.contains(product.getProductId())) {
                score += RecommendationConfig.SCORE_WEIGHT_SALE;
            }

            if (userId != null) {
                List<UserDiscount> userDiscounts = userDiscountsMap.get(userId);
                if (userDiscounts != null) {
                    long usableDiscountCount = userDiscounts.stream()
                            .filter(userDiscount -> !userDiscount.getIsDiscountUsed())
                            .filter(userDiscount -> {
                                Discount discount = discountMap.get(userDiscount.getId().getDiscountId());
                                return discount != null && discount.getDiscountEndDate().isAfter(OffsetDateTime.now());
                            })
                            .filter(userDiscount -> {
                                Discount discount = discountMap.get(userDiscount.getId().getDiscountId());
                                return discount != null && discount.getDiscountMinimumOrderValue() != null && discount.getDiscountMinimumOrderValue().compareTo(representativePrice) <= 0;
                            })
                            .count();

                    score += RecommendationConfig.SCORE_WEIGHT_DISCOUNT;
                    if (usableDiscountCount >= RecommendationConfig.DISCOUNT_BONUS_THRESHOLD) {
                        score += usableDiscountCount * RecommendationConfig.USABLE_DISCOUNT_BONUS_PERCENTAGE;
                    }
                }
            }

            String status = product.getProductStatus() != null ? product.getProductStatus().getProductStatusName() : "a";
            score = switch (status) {
                case "OUT OF STOCK" -> 0.0;
                case "IMPORTING" -> score + RecommendationConfig.PRODUCT_STATUS_SCORE_IMPORTING;
                case "AVAILABLE" -> score + RecommendationConfig.PRODUCT_STATUS_SCORE_AVAILABLE;
                case "RUNNING OUT" -> score + RecommendationConfig.PRODUCT_STATUS_SCORE_RUNNING_OUT;
                case "NEW" -> score + RecommendationConfig.PRODUCT_STATUS_SCORE_NEW;
                default -> score + RecommendationConfig.PRODUCT_STATUS_SCORE_OTHER;
            };
        }

        if (cartAnalysis != null) {
            if (product.equals(cartAnalysis.getMostFrequentProduct())) {
                score += RecommendationConfig.SCORE_WEIGHT_CART_FREQUENCY;
            }
            if (product.equals(cartAnalysis.getHighestQuantityProduct())) {
                score += RecommendationConfig.SCORE_WEIGHT_CART_QUANTITY;
            }
        }

        if (topSoldProductIds.contains(product.getProductId())) {
            score += RecommendationConfig.SCORE_WEIGHT_TRENDING;
        }


        String candidateProductName = product.getProductName();
        if (currentProductName != null && !currentProductName.isBlank() &&
                candidateProductName != null && !candidateProductName.isBlank()) {
            double cosineSimilarity = StringSimilarityUtils.calculateCosineSimilarityTF(currentProductName, candidateProductName);
            double exactMatchBonus = StringSimilarityUtils.calculateExactWordMatchBonus(currentProductName, candidateProductName);
            double nameSimilarityContribution = (cosineSimilarity * RecommendationConfig.SCORE_WEIGHT_NAME_RELATIVE)
                    + (exactMatchBonus * RecommendationConfig.SCORE_WEIGHT_NAME_EXACT_MATCH);
            if (nameSimilarityContribution <= 0) {
                score -= RecommendationConfig.SCORE_WEIGHT_NAME_DISSIMILAR;
                score = Math.max(0, score);
            } else {
                score += nameSimilarityContribution;
            }
        }

        return score;
    }

    private List<Product> sortAndLimitRecommendations(List<ScoredProductDTO> scoredProducts) {
        if (RecommendationConfig.RESULT_SHOULD_SORT) {
            scoredProducts.sort(Comparator.comparingDouble(ScoredProductDTO::getScore)
                    .reversed()
                    .thenComparing(ScoredProductDTO::getPriceDifference));
        }

        return scoredProducts.stream()
                .map(ScoredProductDTO::getProduct)
                .limit(RecommendationConfig.MAX_RECOMMENDATIONS)
                .collect(Collectors.toList());
    }

    private ProductDTO convertToDto(String productId,
                                    Map<String, List<Variation>> variationsByProductId,
                                    Map<String, SaleProduct> saleProductMap,
                                    Map<Integer, Sale> saleMap,
                                    Map<String, Product> productMap) {
        Product product = productMap.get(productId);

        if(product == null){
            return null;
        }

        ProductDTO dto = new ProductDTO();
        dto.setProductId(productId);
        dto.setProductName(product.getProductName());
        dto.setProductCode(product.getProductCode());

        List<Variation> variations = variationsByProductId.getOrDefault(productId, Collections.emptyList());
        dto.setProductImageUrl(variations.isEmpty() ? null : variations.get(0).getVariationImage());

        dto.setProductDescription(product.getProductDescription());
        dto.setCreatedAt(product.getProductCreatedAt());
        dto.setUpdatedAt(product.getProductUpdatedAt());

        SaleProduct saleProduct = saleProductMap.get(productId);
        if (saleProduct != null) {
            Sale sale = saleMap.get(saleProduct.getId().getSaleId());
            if (sale != null && sale.getSaleType() != null) {
                dto.setSaleType(sale.getSaleType());
                dto.setSaleValue(sale.getSaleValue());
            }
        }

        if (product.getBrand() != null) {
            dto.setBrandId(product.getBrand().getId());
        }
        if (product.getProductStatus() != null) {
            dto.setProductStatusId(product.getProductStatus());
        }
        if (product.getCategories() != null) {
            dto.setCategoryIdList(product.getCategories().stream().map(Category::getId).collect(Collectors.toList()));
        }

        dto.setProductPrice(getRepresentativePrice(product));

        List<ProductDTO.ProductVariationDTO> variationDTOs = variations.stream()
                .map(variation -> {
                    ProductDTO.ProductVariationDTO variationDTO = new ProductDTO.ProductVariationDTO();
                    if (variation.getSize() != null)
                        variationDTO.setSizeId(variation.getSize().getId());
                    if (variation.getColor() != null)
                        variationDTO.setColorId(variation.getColor().getId());
                    variationDTO.setProductPrice(variation.getVariationPrice());
                    variationDTO.setProductVariationImage(variation.getVariationImage());
                    return variationDTO;
                })
                .collect(Collectors.toList());
        dto.setVariations(variationDTOs);

        return dto;
    }

    private BigDecimal getRepresentativePrice(Product product) {
        if (product == null || product.getProductVariations() == null || product.getProductVariations().isEmpty()) {
            return null;
        }

        return product.getProductVariations().stream()
                .map(Variation::getVariationPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(product.getProductVariations().size()), 2, RoundingMode.HALF_UP);
    }

    private List<ProductDTO> getSimilarProducts(String currentProductId) {

        Product currentProduct = productRepository.findById(currentProductId).orElse(null);

        if (currentProduct == null) {
            return Collections.emptyList();
        }

        String currentProductName = currentProduct.getProductName();

        List<Product> allProducts = productRepository.findAll();
        Map<String, Product> productMap = allProducts.stream().collect(Collectors.toMap(Product::getProductId, Function.identity()));

        allProducts.remove(currentProduct);

        PurchaseAnalysisDTO dummyAnalysis = new PurchaseAnalysisDTO();
        dummyAnalysis.setPurchasedProducts(Collections.singletonList(currentProduct));
        dummyAnalysis.setMostFrequentSize(currentProduct.getProductVariations().stream().map(Variation::getSize).filter(Objects::nonNull).map(Size::getSizeName).findFirst().orElse(null));
        dummyAnalysis.setMostFrequentBrand(currentProduct.getBrand() != null ? currentProduct.getBrand().getBrandName() : null);
        BigDecimal currentPrice = getRepresentativePrice(currentProduct);
        if (currentPrice != null) {
            dummyAnalysis.setAveragePrice(currentPrice.doubleValue());
            dummyAnalysis.setPriceRangeMin(currentPrice.doubleValue() * (1 - RecommendationConfig.PRICE_RANGE_EXPANSION_FACTOR));
            dummyAnalysis.setPriceRangeMax(currentPrice.doubleValue() * (1 + RecommendationConfig.PRICE_RANGE_EXPANSION_FACTOR));
        }

        Map<String, Long> productStockMap = allProducts.stream()
                .collect(Collectors.toMap(
                        Product::getProductId,
                        product -> Long.valueOf(Optional.ofNullable(stockVariationRepository.getTotalStockQuantityForProduct(product.getProductId())).orElse(0))
                ));

        List<SaleProduct> saleProducts = saleProductRepository.findAll();
        Set<String> saleProductIds = saleProducts.stream()
                .map(saleProduct -> saleProduct.getId().getProductId())
                .collect(Collectors.toSet());

        List<String> topSoldProductIds = orderRepository.findTopSoldProductIds(RecommendationConfig.TRENDING_DAYS_WINDOW, RecommendationConfig.MAX_TRENDING_PRODUCTS);

        List<ScoredProductDTO> scoredProducts = allProducts.stream()
                .map(product -> {
                    double score = calculateRecommendationScore(product, dummyAnalysis, null, null, saleProductIds, productStockMap, null, null, topSoldProductIds, currentProductName);
                    BigDecimal representativePrice = getRepresentativePrice(product);
                    double priceDifference = (representativePrice != null && currentPrice != null)
                            ? Math.abs(representativePrice.doubleValue() - currentPrice.doubleValue())
                            : Double.MAX_VALUE;
                    return new ScoredProductDTO(product, score, priceDifference);
                })
                .filter(scoredProduct -> scoredProduct.getScore() > RecommendationConfig.MINIMUM_RECOMMENDATION_SCORE)
                .filter(scoredProduct -> productStockMap.getOrDefault(scoredProduct.getProduct().getProductId(), 0L) > 0)
                .collect(Collectors.toList());

        List<Product> similarProducts = sortAndLimitRecommendations(scoredProducts);
        return getProductsWithDetails(similarProducts, productMap, productStockMap);
    }

    private List<ProductDTO> getProductsWithDetails(List<Product> products,
                                                    Map<String, Product> productMap,
                                                    Map<String, Long> productStockMap) {
        List<String> productIds = products.stream().map(Product::getProductId).toList();

        List<Variation> allVariations = variationRepository.findProductVariationsByProductIds(productIds);
        Map<String, List<Variation>> variationsByProductId = allVariations.stream()
                .collect(Collectors.groupingBy(v -> v.getProduct().getProductId()));

        List<SaleProduct> allSaleProducts = saleProductRepository.findSaleProductsByProductIds(productIds);
        Map<String, SaleProduct> saleProductMap = allSaleProducts.stream()
                .collect(Collectors.toMap(sp -> sp.getId().getProductId(), Function.identity()));

        Set<Integer> saleIds = allSaleProducts.stream()
                .map(sp -> sp.getId().getSaleId())
                .collect(Collectors.toSet());
        List<Sale> sales = saleRepository.findAllById(saleIds);
        Map<Integer, Sale> saleMap = sales.stream().collect(Collectors.toMap(Sale::getId, Function.identity()));


        List<ProductDTO> productDTOs = products.stream()
                .map(product -> convertToDto(product.getProductId(), variationsByProductId, saleProductMap, saleMap, productMap))
                .collect(Collectors.toList());

        int needed = RecommendationConfig.MAX_RECOMMENDATIONS - productDTOs.size();
        Set<String> addedProductIds = new HashSet<>(productIds);

        if (needed > 0) {
            List<ProductDTO> additionalProducts = productMap.values().stream()
                    .filter(p -> !addedProductIds.contains(p.getProductId()))
                    .filter(p -> productStockMap.getOrDefault(p.getProductId(), 0L) > 0)
                    .limit(needed)
                    .map(product -> {
                        addedProductIds.add(product.getProductId());
                        return convertToDto(product.getProductId(), variationsByProductId, saleProductMap, saleMap, productMap);
                    })
                    .toList();
            productDTOs.addAll(additionalProducts);
        }

        if (RecommendationConfig.RESULT_SHOULD_SHUFFLE) {
            Collections.shuffle(productDTOs);
        }

        return productDTOs.stream().limit(RecommendationConfig.MAX_RECOMMENDATIONS_OUTPUT).toList();
    }
}