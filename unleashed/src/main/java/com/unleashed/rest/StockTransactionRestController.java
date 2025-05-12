package com.unleashed.rest;

import com.unleashed.dto.StockTransactionDTO;
import com.unleashed.dto.TransactionCardDTO;
import com.unleashed.service.StockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-transactions")
public class StockTransactionRestController {
    private final StockTransactionService stockTransactionService;

    @Autowired
    public StockTransactionRestController(StockTransactionService stockTransactionService) {
        this.stockTransactionService = stockTransactionService;
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping
    public ResponseEntity<List<TransactionCardDTO>> getStockTransactions() {

        return ResponseEntity.ok(stockTransactionService.findAllTransactionCardDTOs());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @PostMapping
    public ResponseEntity<String> bulkImportTransactions(
            @RequestBody StockTransactionDTO stockTransactionDTO) {
        boolean check = stockTransactionService.createStockTransactions(stockTransactionDTO);
        if (check) {
            return ResponseEntity.ok("Bulk import of stock transactions successful");
        }
        return ResponseEntity.badRequest().body("Bulk import of stock transactions failed");
    }
}
