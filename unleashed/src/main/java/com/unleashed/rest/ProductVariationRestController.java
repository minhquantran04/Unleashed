package com.unleashed.rest;

import com.unleashed.dto.ProductDTO;
import com.unleashed.dto.ResponseDTO;
import com.unleashed.entity.ComposeKey.StockVariationId;
import com.unleashed.entity.StockVariation;
import com.unleashed.entity.Variation;
import com.unleashed.repo.StockVariationRepository;
import com.unleashed.repo.VariationRepository;
import com.unleashed.service.ProductVariationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/product-variations")
public class ProductVariationRestController {
    private final ProductVariationService productVariationService;
    private final StockVariationRepository stockVariationRepository;
    private final VariationRepository variationRepository;

    @Autowired
    public ProductVariationRestController(ProductVariationService productVariationService, StockVariationRepository stockVariationRepository, VariationRepository variationRepository) {
        this.productVariationService = productVariationService;
        this.stockVariationRepository = stockVariationRepository;
        this.variationRepository = variationRepository;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @DeleteMapping("/{variationid}")
    public ResponseEntity<ResponseDTO> deleteProductVariation(@PathVariable int variationid) {
        ResponseDTO responseDTO = new ResponseDTO();

        // Kiểm tra xem có stock nào không
        Integer stockQuantity = stockVariationRepository.findStockProductByProductVariationId(variationid);

        if (stockQuantity == null || stockQuantity == 0) {
            // Nếu chưa có stock, tạo mới một bản ghi StockVariation với quantity là -1
            StockVariation newStock = new StockVariation();
            StockVariationId newStockId = new StockVariationId();
            newStockId.setVariationId(variationid);
            newStockId.setStockId(1); // Giả sử stockId là 1, bạn có thể thay đổi theo logic nghiệp vụ
            newStock.setId(newStockId);
            newStock.setStockQuantity(-1);
            stockVariationRepository.save(newStock);


            responseDTO.setStatusCode(200);
            responseDTO.setMessage("No stock found, so new stock created with quantity -1");
            return ResponseEntity.ok(responseDTO);
        }

        // Lấy danh sách StockVariation để cập nhật về 0
        List<StockVariation> stockVariations = stockVariationRepository.findByVariationId(variationid);
        if (stockVariations.isEmpty()) {
            responseDTO.setStatusCode(404);
            responseDTO.setMessage("Variation not found");
            return ResponseEntity.status(404).body(responseDTO);
        }

        // Cập nhật stock quantity về 0
        for (StockVariation sv : stockVariations) {
            sv.setStockQuantity(-1);
        }
        stockVariationRepository.saveAll(stockVariations);

        responseDTO.setMessage("Stock quantity updated to 0 successfully");
        responseDTO.setStatusCode(200);
        return ResponseEntity.ok(responseDTO);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Variation> getProductVariation(@PathVariable int id) {
        return ResponseEntity.ok(productVariationService.findById(id));
    }

    @PreAuthorize("hasAnyAuthority('ADMIN','STAFF')")
    @PutMapping("/{variationId}")
    public ResponseEntity<Variation> updateProductVariation(
            @PathVariable int variationId,
            @RequestBody ProductDTO.ProductVariationDTO variationDTO) {
        Variation updatedVariation = productVariationService.updateProductVariation(variationId, variationDTO);
        return ResponseEntity.ok(updatedVariation);
    }
}
