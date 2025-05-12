import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api";

export const getWishlist = async (username) => {
    try {
        const response = await apiClient.get(`/api/wishlist?username=${username}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

export const checkWishlist = async (username, productId) => {
    try {
        const response = await apiClient.get(`/api/wishlist/check?username=${username}&productId=${productId}`);
        return response.data;
    } catch (error) {
        console.error("Error checking wishlist status:", error);
        return false; // Trả về false nếu có lỗi
    }
};

export const addToWishlist = async (username, productId) => {
    try {
        const response = await apiClient.post(`/api/wishlist/add`, null, {
            params: { username, productId }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return null;
    }
};

export const removeFromWishlist = async (username, productId) => {
    try {
        await apiClient.delete(`/api/wishlist/remove?username=${username}&productId=${productId}`);
        return true;
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        toast.error("Failed to remove from wishlist. Please try again.", { position: "top-right", transition: Zoom });
        return false;
    }
};
