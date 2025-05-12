package com.unleashed.rest;

import com.fasterxml.jackson.annotation.JsonView;
import com.unleashed.dto.StockDetailDTO;
import com.unleashed.entity.Stock;
import com.unleashed.service.StockService;
import com.unleashed.util.Views;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockRestController {

    private final StockService stockService;

    @Autowired
    public StockRestController(StockService stockService) {
        this.stockService = stockService;
    }


    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping
    @JsonView(Views.ListView.class)
    public List<Stock> getStocks() {
        return stockService.findAll();
    }

//    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
//    @GetMapping("/{id}")
//    @JsonView(Views.StockView.class)
//    public Stock getStockById(@PathVariable int id) {
//        return stockService.findById(id).orElse(null);
//    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    @GetMapping("/{id}")
    public List<StockDetailDTO> getStockById(@PathVariable int id) {
        return stockService.getStockDetails(id);
    }

}
