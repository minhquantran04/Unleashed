package com.unleashed.service;

import com.unleashed.dto.StockTransactionDTO;
import com.unleashed.dto.TransactionCardDTO;
import com.unleashed.entity.ComposeKey.StockVariationId;
import com.unleashed.entity.*;
import com.unleashed.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StockTransactionService {

    private final VariationRepository variationRepository;
    private final TransactionRepository transactionRepository;
    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final TransactionTypeRepository transactionTypeRepository;
    private final StockVariationRepository stockVariationRepository;
    private final ProductStatusRepository productStatusRepository;
    private final ProviderRepository providerRepository;


    @Autowired
    public StockTransactionService(TransactionRepository transactionRepository,
                                   StockRepository stockRepository,
                                   ProductRepository productRepository,
                                   VariationRepository variationRepository,
                                   UserRepository userRepository,
                                   TransactionTypeRepository transactionTypeRepository,
                                   StockVariationRepository stockVariationRepository,
                                   ProductStatusRepository productStatusRepository,
                                   ProviderRepository providerRepository) {
        this.transactionRepository = transactionRepository;
        this.stockRepository = stockRepository;
        this.productRepository = productRepository;
        this.variationRepository = variationRepository;
        this.userRepository = userRepository;
        this.transactionTypeRepository = transactionTypeRepository;
        this.stockVariationRepository = stockVariationRepository;
        this.productStatusRepository = productStatusRepository;
        this.providerRepository = providerRepository;
    }

//    public Transaction createStockTransaction(StockTransactionDTO stockTransactionDTO) {
//        Transaction transaction = StockTransactionMapper.INSTANCE.toEntity(stockTransactionDTO);
//        transaction.setStock(stockRepository.findById(stockTransactionDTO.getStockId()).get());
//        transaction.setVariation(variationRepository.findById(stockTransactionDTO.getVariationId()).get());
//        return transactionRepository.save(transaction);
//    }


    // Method to get TransactionCardDTOs
    public List<TransactionCardDTO> findAllTransactionCardDTOs() {
        return transactionRepository.findAllTransactionCardDTOByOrderByIdDesc();
    }

    @Transactional
    public boolean createStockTransactions(StockTransactionDTO stockTransactionDTO) {
        try {

            Optional<Provider> provider = providerRepository.findById(stockTransactionDTO.getProviderId());
            if (provider.isEmpty()) {
                throw new IllegalArgumentException("Provider not found with ID: " + stockTransactionDTO.getProviderId());
            }

            Optional<Stock> stock = stockRepository.findById(stockTransactionDTO.getStockId());
            if (stock.isEmpty()) {
                throw new IllegalArgumentException("Stock not found with ID: " + stockTransactionDTO.getStockId());
            }

            for (StockTransactionDTO.ProductVariationQuantity variationQuantity : stockTransactionDTO.getVariations()) {
                Optional<Variation> variation = variationRepository.findById(variationQuantity.getProductVariationId());
                if (variation.isEmpty()) {
                    throw new IllegalArgumentException("Product variation not found with ID: " + variationQuantity.getProductVariationId());
                }

                Transaction transaction = new Transaction();

                transaction.setStock(stock.get());
                transaction.setVariation(variation.get());
                transaction.setProvider(provider.get());
                transaction.setInchargeEmployee(userRepository.findByUserUsername(stockTransactionDTO.getUsername()).orElse(null));
                transaction.setTransactionType(transactionTypeRepository.findById(1).isPresent() ? transactionTypeRepository.findById(1).get() : null); // Assuming IN transaction
                transaction.setTransactionQuantity(variationQuantity.getQuantity());
                transactionRepository.save(transaction);

                //BRUHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH
                StockVariationId stockVariationId = new StockVariationId();
                stockVariationId.setStockId(stock.get().getId());
                stockVariationId.setVariationId(variation.get().getId());

                Optional<StockVariation> existingStockVariation = stockVariationRepository.findById(stockVariationId);

                if (existingStockVariation.isPresent()) {
                    StockVariation stockVariationToUpdate = existingStockVariation.get();
                    stockVariationToUpdate.setStockQuantity(stockVariationToUpdate.getStockQuantity() + variationQuantity.getQuantity());
                    stockVariationRepository.save(stockVariationToUpdate);
                } else {
                    StockVariation stockVariation = new StockVariation();
                    stockVariation.setId(stockVariationId);
                    stockVariation.setStockQuantity(variationQuantity.getQuantity());
                    stockVariationRepository.save(stockVariation);
                }
                ProductStatus productStatus = productStatusRepository.findById(3).isPresent() ? productStatusRepository.findById(3).get() : null;
                Product product = variation.get().getProduct();
                product.setProductStatus(productStatus);

            }
        } catch (IllegalArgumentException e) {
            return false;
        }
        return true;
    }
}
