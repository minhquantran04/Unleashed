import { toast, Zoom } from "react-toastify";
import { apiClient } from "../core/api"

export const createReview = async (review, authHeader) => {
    console.log(review);
    console.log(authHeader);
    try {
        const response = apiClient.post("/api/reviews", {
            productId: review.productId,
            reviewComment: review.reviewComment,
            reviewRating: review.reviewRating,
            userId: review.userId,
            variationSingleId: review.variationSingleId,
            orderId: review.orderId
        },
        {
            headers: {
                Authorization: authHeader
            },
        },
    )
    return response;
} catch (error) {
    console.error("Error during review product:", error); // Log error
    toast.error("Error during review product: " + error?.response?.data, {
        position: "top-center",
        transition: Zoom
    })
    throw error; // Re-throw error to be handled in component
}
};

export const getDashboardReviews = async (page = 0, size = 50, authHeader) => {
    try {
        const response = await apiClient.get(`/api/reviews/get-all?page=${page}&size=${size}`, {
            headers: {
                Authorization: authHeader
            },
        });
        return response.data; // API trả về Page<DashboardReviewDTO>, nên response.data sẽ là object Page
    } catch (error) {
        console.error("Error fetching dashboard reviews:", error);
        toast.error("Error fetching dashboard reviews: " + error?.response?.data, {
            position: "top-center",
            transition: Zoom
        });
        throw error;
    }
};

export const getDashboardProductReviews = async (productId, authHeaderString) => { // Đổi tên tham số thành authHeaderString
    console.log("authHeaderString in getDashboardProductReviews:", authHeaderString); // Log giá trị authHeaderString
    try {
        const response = await apiClient.get(`/api/reviews/dashboard/product/${productId}`, {
            headers: {
                Authorization: authHeaderString // Sử dụng authHeaderString trực tiếp, không gọi ()
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching dashboard product reviews:", error);
        toast.error("Error fetching dashboard product reviews: " + error?.response?.data, {
            position: "top-center",
            transition: Zoom
        });
        throw error;
    }
};
