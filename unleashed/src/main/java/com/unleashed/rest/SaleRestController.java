package com.unleashed.rest;

import com.unleashed.entity.Product;
import com.unleashed.entity.Sale;
import com.unleashed.repo.SaleRepository;
import com.unleashed.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sales")
public class SaleRestController {

    private final SaleService saleService;

    @Autowired
    public SaleRestController(SaleService saleService, SaleRepository saleRepository) {
        this.saleService = saleService;
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllSales() {
        try {
            return ResponseEntity.ok(saleService.findAll());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @GetMapping("/{saleId}")
    public ResponseEntity<?> getSaleById(@PathVariable Integer saleId) {
        try {
            return saleService.findSaleById(saleId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @PostMapping
    public ResponseEntity<?> createSale(@RequestBody Sale sale) {
        try {
            return ResponseEntity.ok(saleService.createSale(sale));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @PutMapping("/{saleId}")
    public ResponseEntity<?> updateSale(@PathVariable Integer saleId, @RequestBody Sale sale) {
        try {
            return saleService.updateSale(saleId, sale);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{saleId}")
    public ResponseEntity<?> deleteSale(@PathVariable Integer saleId) {
        try {
            return saleService.deleteSale(saleId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @PostMapping("/{saleId}/products")
    public ResponseEntity<?> addProductsToSale(@PathVariable int saleId, @RequestBody Map<String, List<String>> requestBody) {
        List<String> productIds = requestBody.get("productIds");

        // Kiểm tra danh sách productIds không rỗng
        if (productIds == null || productIds.isEmpty()) {
            return ResponseEntity.badRequest().body("Product IDs must not be null or empty");
        }
        try {
            return saleService.addProductsToSale(saleId, productIds);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @DeleteMapping("/{saleId}/products")
    public ResponseEntity<?> removeProductFromSale(@PathVariable int saleId, @RequestParam String productId) {
        try {
            return saleService.removeProductFromSale(saleId, productId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('STAFF', 'ADMIN')")
    @GetMapping("/{saleId}/products")
    public ResponseEntity<?> getProductsInSale(@PathVariable int saleId) {
        try {
            return saleService.getProductsInSale(saleId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping("/products")
    public ResponseEntity<?> getListProductInSales() {
        try {
            return saleService.getListProductsInSales();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
