package com.unleashed.service;

import com.unleashed.dto.ResponseDTO;
import com.unleashed.entity.ComposeKey.SaleProductId;
import com.unleashed.entity.Product;
import com.unleashed.entity.Sale;
import com.unleashed.entity.SaleProduct;
import com.unleashed.entity.SaleStatus;
import com.unleashed.repo.ProductRepository;
import com.unleashed.repo.SaleProductRepository;
import com.unleashed.repo.SaleRepository;
import com.unleashed.repo.SaleStatusRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    private final SaleProductRepository saleProductRepository;
    private final SaleStatusRepository saleStatusRepository;

    public SaleService(SaleRepository saleRepository, ProductRepository productRepository, SaleProductRepository saleProductRepository, SaleStatusRepository saleStatusRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
        this.saleProductRepository = saleProductRepository;
        this.saleStatusRepository = saleStatusRepository;
    }

    @Transactional
    public List<Sale> findAll() {
        List<Sale> saleList = saleRepository.findAllByOrderByIdDesc();
        SaleStatus expiredeStaus = saleStatusRepository.getReferenceById(3);
        SaleStatus inactiveStatus = saleStatusRepository.getReferenceById(1);
        OffsetDateTime nowDate = OffsetDateTime.now();
        saleList.forEach(sale -> {
            if (sale.getSaleEndDate().isBefore(nowDate)) {
                sale.setSaleStatus(expiredeStaus);
            } else if (sale.getSaleStatus().getId() == (expiredeStaus.getId())) {
                System.out.println("ttttt");
                sale.setSaleStatus(inactiveStatus);
                System.out.println(sale.getSaleStatus().getId());
                saleRepository.save(sale);
            }
        });
        saleRepository.saveAll(saleList);
        return saleList;
    }

    @Transactional
    public Sale createSale(Sale sale) {
        if (sale == null) {
            throw new IllegalArgumentException("Sale data must not be null");
        }
        sale.setSaleCreatedAt(OffsetDateTime.now());
        return saleRepository.save(sale);
    }

    @Transactional
    public ResponseEntity<?> updateSale(Integer saleId, Sale saleData) {
        ResponseDTO responseDTO = new ResponseDTO();
        responseDTO.setMessage("Updated sale Successfully");
        Sale existingSale = saleRepository.findById(saleId).orElse(null);

        // Update the sale properties
        if (existingSale == null) {
            responseDTO.setMessage("Sale not found");
            responseDTO.setStatusCode(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
        }
        existingSale.setSaleType(saleData.getSaleType());
        existingSale.setSaleValue(saleData.getSaleValue());
        existingSale.setSaleStartDate(saleData.getSaleStartDate());
        existingSale.setSaleEndDate(saleData.getSaleEndDate());
        existingSale.setSaleStatus(saleData.getSaleStatus());
        existingSale.setSaleUpdatedAt(OffsetDateTime.now());
        Sale EditedSale = saleRepository.save(existingSale);

        return ResponseEntity.ok().body(EditedSale);
    }

    @Transactional
    public ResponseEntity<?> deleteSale(Integer saleId) {
        ResponseDTO responseDTO = new ResponseDTO();
        Sale sale = saleRepository.findById(saleId).orElse(null);

//        System.out.println(sale.getSaleStatus().getId());
        if (!saleRepository.existsById(saleId)) {
            responseDTO.setMessage("Sale not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDTO);
        }

        SaleStatus defaultStatus = saleStatusRepository.findById(1)
                .orElseThrow(() -> new EntityNotFoundException("Default SaleStatus not found"));

        sale.setSaleStatus(defaultStatus);
        saleRepository.save(sale);
        return ResponseEntity.status(HttpStatus.OK).body(responseDTO);
    }

    @Transactional
    public ResponseEntity<?> findSaleById(Integer saleId) {
        ResponseDTO responseDTO = new ResponseDTO();
        Sale sale = saleRepository.findById(saleId).orElse(null);
        if (sale == null) {
            responseDTO.setMessage("Sale not found");
            responseDTO.setStatusCode(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDTO);
        }
        return ResponseEntity.ok().body(sale);
    }

    @Transactional
    public ResponseEntity<?> addProductsToSale(Integer saleId, List<String> productIds) {
        ResponseDTO responseDTO = new ResponseDTO();
        Optional<Sale> saleOptional = saleRepository.findById(saleId);
//        System.out.println("saleOptional: "+saleOptional);
        if (saleOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Sale not found");
        }

        List<SaleProduct> saleProductsToSave = new ArrayList<>();
        for (String productId : productIds) {
            Optional<Product> productOptional = productRepository.findById(productId);
            if (productOptional.isEmpty()) continue;

            SaleProductId id = new SaleProductId(saleId, productId);
            SaleProduct saleProduct = new SaleProduct(id);
            saleProductsToSave.add(saleProduct);
        }

        if (!saleProductsToSave.isEmpty()) {
            saleProductRepository.saveAll(saleProductsToSave);
        }

        return ResponseEntity.ok().body("Products added successfully");
    }

    @Transactional
    public ResponseEntity<ResponseDTO> removeProductFromSale(int saleId, String productId) {
        ResponseDTO responseDTO = new ResponseDTO();
        try {
            Sale sale = saleRepository.findById(saleId)
                    .orElseThrow(() -> new RuntimeException("Sale not found"));

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            SaleProductId id = new SaleProductId();
            id.setSaleId(saleId);
            id.setProductId(productId);

            Optional<SaleProduct> existingSaleProductOpt = saleProductRepository.findById(id);

            if (existingSaleProductOpt.isPresent()) {
                saleProductRepository.delete(existingSaleProductOpt.get());
                responseDTO.setMessage("Product removed successfully from sale.");
                responseDTO.setStatusCode(200);
            } else {
                responseDTO.setMessage("Product not found in this sale.");
                responseDTO.setStatusCode(404);
            }
        } catch (RuntimeException e) {
            responseDTO.setMessage(e.getMessage());
            responseDTO.setStatusCode(404);
        }
        return ResponseEntity.status(responseDTO.getStatusCode()).body(responseDTO);
    }

    @Transactional
    public ResponseEntity<?> getProductsInSale(int saleId) {
        Optional<Sale> saleOptional = saleRepository.findById(saleId);
        if (saleOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sale not found");
        }

        List<SaleProduct> saleProducts = saleProductRepository.findByIdSaleId(saleId);

        List<Product> products = saleProducts.stream()
                .map(sp -> productRepository.findById(sp.getId().getProductId()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }


    @Transactional
    public ResponseEntity<?> getListProductsInSales() {
        return ResponseEntity.status(HttpStatus.OK).body(saleProductRepository.getAllProductsInSales());
    }

}
