package com.unleashed.service;

import com.unleashed.dto.CartDTO;
import com.unleashed.entity.Cart;
import com.unleashed.entity.ComposeKey.CartId;
import com.unleashed.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final VariationRepository variationRepository;
    private final StockVariationRepository stockVariationRepository;
    private final SaleRepository saleRepository;


    @Autowired
    public CartService(CartRepository cartRepository, ProductRepository productRepository, VariationRepository variationRepository, StockVariationRepository stockVariationRepository, SaleRepository saleRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.variationRepository = variationRepository;
        this.stockVariationRepository = stockVariationRepository;
        this.saleRepository = saleRepository;
    }

    public LinkedMultiValueMap<String, CartDTO> getCartByUserId(String userid) {

        List<Cart> userCart = cartRepository.findAllById_UserId(userid);

        List<CartDTO> cart = userCart.stream().map(uc ->
                        CartDTO.builder()
                                .variation(variationRepository.findById(uc.getId().getVariationId()).orElse(null))
                                .quantity(uc.getCartQuantity())
                                .build())
                .toList();

        cart.forEach(c -> {
            c.setStockQuantity(stockVariationRepository.findStockProductByProductVariationId(c.getVariation().getId()));
            c.setSale(saleRepository.findSaleByProductId(c.getVariation().getProduct().getProductId()).orElse(null));
        });

        LinkedMultiValueMap<String, CartDTO> productList = new LinkedMultiValueMap<>();
        cart.forEach(v -> productList.add(v.getVariation().getProduct().getProductName(), v));


        return productList;
    }

    public void addToCart(String userId, Integer variationId, Integer quantity) {
        CartId cartId = CartId.builder()
                .userId(userId)
                .variationId(variationId)
                .build();

        Cart cart = cartRepository.findById(cartId)
                .orElse((null));

        if (cart == null) {
            cart = Cart.builder()
                    .id(cartId)
                    .cartQuantity(quantity)
                    .build();
        } else {
            cart.setCartQuantity(cart.getCartQuantity() + quantity);
        }
        cartRepository.save(cart);
    }

    public void removeFromCart(String userId, Integer variationId) {
        cartRepository.findById(CartId
                .builder()
                .userId(userId)
                .variationId(variationId)
                .build()).ifPresentOrElse(cartRepository::delete,
                () -> {
                    throw new NullPointerException("Cart not found");
                });
    }

    public void removeAllFromCart(String userId) {
        if (cartRepository.findAllById_UserId(userId).isEmpty()) {
            throw new NullPointerException("No items in cart");
        }
        cartRepository.deleteAllById_UserId(userId);
    }
}
