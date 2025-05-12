package com.unleashed.service;

import com.unleashed.dto.WishlistDTO;
import com.unleashed.entity.ComposeKey.WishlistId;
import com.unleashed.entity.User;
import com.unleashed.entity.Wishlist;
import com.unleashed.repo.ProductRepository;
import com.unleashed.repo.UserRepository;
import com.unleashed.repo.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public List<WishlistDTO> getWishlistByUser(String username) {
        // 1. Tìm User entity dựa trên username
        User user = userRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getRole().getId().equals(2)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        String userId = user.getUserId(); // Lấy userId từ User entity

        return wishlistRepository.findWishlistByUserId(userId);
    }

    public Wishlist addToWishlist(String username, String productId) {
        // 1. Tìm User entity dựa trên username
        User user = userRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getRole().getId().equals(2)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        if (isProductInWishlist(username, productId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product already exists in Wishlist");
        }

        String userId = user.getUserId(); // Lấy userId từ User entity

        // 2. Tạo WishlistId và Wishlist entity như cũ, nhưng sử dụng userId vừa lấy
        WishlistId wishlistId = new WishlistId();
        wishlistId.setUserId(userId); // Sử dụng userId đã lấy được
        wishlistId.setProductId(productId);

        Wishlist wishlist = new Wishlist();
        wishlist.setId(wishlistId);

        return wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(String username, String productId) {
        // 1. Tìm User entity dựa trên username
        User user = userRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!user.getRole().getId().equals(2)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (!productRepository.existsById(productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
        if (!isProductInWishlist(username, productId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found in Wishlist");
        }

        String userId = user.getUserId();

        WishlistId wishlistId = new WishlistId();
        wishlistId.setUserId(userId);
        wishlistId.setProductId(productId);

        wishlistRepository.deleteById(wishlistId);
    }

    public boolean isProductInWishlist(String username, String productId) {
        User user = userRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        String userId = user.getUserId();
        WishlistId wishlistId = new WishlistId();
        wishlistId.setUserId(userId);
        wishlistId.setProductId(productId);
        return wishlistRepository.existsById(wishlistId);
    }
}
