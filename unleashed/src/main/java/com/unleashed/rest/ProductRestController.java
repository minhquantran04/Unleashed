package com.unleashed.rest;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.dto.ProductDTO;
import com.unleashed.dto.ProductDetailDTO;
import com.unleashed.dto.ProductItemDTO;
import com.unleashed.dto.ProductListDTO;
import com.unleashed.entity.Product;
import com.unleashed.entity.Variation;
import com.unleashed.repo.ProductRepository;
import com.unleashed.repo.SizeRepository;
import com.unleashed.repo.StockVariationRepository;
import com.unleashed.repo.VariationRepository;
import com.unleashed.service.BrandService;
import com.unleashed.service.CategoryService;
import com.unleashed.service.ProductService;
import com.unleashed.util.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {
    private final RestClient.Builder builder;
    private final SizeRepository sizeRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final BrandService brandService;
    private final CategoryService categoryService;
    private final VariationRepository variationRepository;
    private final StockVariationRepository stockVariationRepository;

    @Autowired
    public ProductRestController(ProductService productService, BrandService brandService, CategoryService categoryService, RestClient.Builder builder, SizeRepository sizeRepository, ProductRepository productRepository, VariationRepository variationRepository, StockVariationRepository stockVariationRepository) {
        this.productService = productService;
        this.brandService = brandService;
        this.categoryService = categoryService;
        this.builder = builder;
        this.sizeRepository = sizeRepository;
        this.productRepository = productRepository;
        this.variationRepository = variationRepository;
        this.stockVariationRepository = stockVariationRepository;
    }

    @GetMapping()
    public ResponseEntity<List<ProductListDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getListProduct());
    }

    @GetMapping("/{productId}/detail")
    public ResponseEntity<ProductDetailDTO> getProductsById(@PathVariable String productId) {
        Product products = productService.findById(productId);
        List<Variation> availableVariations = variationRepository.findProductVariationByProductId(productId);
        availableVariations.removeIf(variation -> {
            Integer stock = stockVariationRepository.findStockProductByProductVariationId(variation.getId());
            return stock != null && stock < 0;
        });

//        availableVariations.removeIf(variation -> stockVariationRepository.findStockProductByProductVariationId(variation.getId()) != null && stockVariationRepository.findStockProductByProductVariationId(variation.getId()) < 0 );
        ProductDetailDTO dto = ProductDetailDTO.builder()
                .productId(products.getProductId())
                .productName(products.getProductName())
                .productCode(products.getProductCode())
                .productDescription(products.getProductDescription())
                .productStatusId(products.getProductStatus())
                .productVariations(availableVariations)
                .productCreatedAt(products.getProductCreatedAt())
                .productUpdatedAt(products.getProductUpdatedAt())
                .brand(products.getBrand())
                .categories(products.getCategories())
                .build();
        return ResponseEntity.ok(dto);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping("/{productId}/product-variations")
    @JsonView(Views.ProductView.class)
    public ResponseEntity<?> getProductVariationsByProductId(@PathVariable String productId) {
        Product product = productService.findById(productId);
//        System.out.println("Name: " + product.getProductName() +
//                " Variation price: " + product.getProductVariations().get(0).getVariationPrice() +
//                " Color: " + product.getProductVariations().get(0).getColor().getColorName() +
//                " Size: " + product.getProductVariations().get(0).getSize().getSizeName() +
//                " Class: " + product.getProductVariations().get(0).getClass()
//        );

        if (product != null && product.getProductVariations() != null) {
            List<Variation> availableVariations = product.getProductVariations();
            availableVariations.removeIf(variation -> {
                Integer stock = stockVariationRepository.findStockProductByProductVariationId(variation.getId());
                return stock != null && stock < 0;
            });

//            availableVariations.removeIf(variation -> stockVariationRepository.findStockProductByProductVariationId(variation.getId()) != null && stockVariationRepository.findStockProductByProductVariationId(variation.getId()) < 0 );
            return ResponseEntity.ok(availableVariations);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductItemByProductId(@PathVariable String productId) {
        ProductItemDTO product = productService.findProductItemById(productId);
        if (product != null) {
            return ResponseEntity.ok().body(product);
        }
        return ResponseEntity.status(404).body("Product not found!");
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping("/{productId}/product-variations")
    public ResponseEntity<Product> addProductVariations(
            @PathVariable("productId") String productId,
            @RequestBody ProductDTO productDTO) {

        Product product = productService.addVariationsToExistingProduct(productId, productDTO.getVariations());
        //System.out.println(product);
        return ResponseEntity.ok(product);
    }


    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody ProductDTO productDTO) {
        System.out.println(productDTO);
        Product product = productService.addProduct(productDTO);
        return ResponseEntity.ok(product);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PutMapping("/{id}")
    public Product updateProduct(@RequestBody ProductDTO productDTO, @PathVariable String id) {
        productDTO.setProductId(id);
        System.out.println(productDTO);
        return productService.updateProduct(productDTO, id);

    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/search") // Endpoint tìm kiếm sản phẩm
    public ResponseEntity<Page<ProductListDTO>> searchProducts(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "1000") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductListDTO> productPage = productService.searchProducts(query, pageable);
        return ResponseEntity.ok(productPage);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @GetMapping("/in-stock")
    public ResponseEntity<List<ProductDetailDTO>> getProductsInStock() {
        List<ProductDetailDTO> productsInStock = productService.getProductsInStock();
        return ResponseEntity.ok(productsInStock);
    }
}
