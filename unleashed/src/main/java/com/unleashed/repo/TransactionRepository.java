package com.unleashed.repo;

import com.unleashed.dto.TransactionCardDTO;
import com.unleashed.entity.Provider;
import com.unleashed.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    @Query(value = """
                SELECT NEW com.unleashed.dto.TransactionCardDTO(
                    t.id,
                    v.variationImage,
                    p.productName,
                    s.stockName,
                    tt.transactionTypeName,
                    cat.categoryName,
                    br.brandName,
                    si.sizeName,
                    col.colorName,
                    col.colorHexCode,
                    t.transactionProductPrice,
                    t.transactionQuantity,
                    t.transactionDate,
                    u.userUsername,
                    pr.providerName
                )
                FROM Transaction t
                LEFT JOIN t.variation v
                LEFT JOIN v.product p
                LEFT JOIN t.stock s
                LEFT JOIN t.transactionType tt
                LEFT JOIN p.categories cat
                LEFT JOIN p.brand br
                LEFT JOIN v.size si
                LEFT JOIN v.color col
                LEFT JOIN t.inchargeEmployee u
                LEFT JOIN t.provider pr
                ORDER BY t.id DESC
            """)
    List<TransactionCardDTO> findAllTransactionCardDTOByOrderByIdDesc();

    boolean existsByProvider(Provider provider);
}