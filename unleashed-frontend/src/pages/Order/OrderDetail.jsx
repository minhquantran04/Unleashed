import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Typography,
  Box,
  Divider,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";
import CustomizedSteppers from "../../components/inputs/StepperCommon";
import { formatPrice } from "../../components/format/formats";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { confirmOrder, getOrderById, returnOrder } from "../../service/OrderSevice"; // Import returnOrder
import { cancelOrder } from "../../service/CheckoutService";
import ReviewModal from "../../components/modals/Review";
import { createReview } from "../../service/ReviewService";
import { toast } from "react-toastify";
import { useRef } from "react";

function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState("");
  const authHeader = useAuthHeader();
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const fetchOnce = useRef(false);
  const handleClickBack = () => {
    navigate("/user/orders");
  };
  useEffect(() => {
    if (fetchOnce.current) return;
    fetchOnce.current = true;
  
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        const response = await getOrderById(orderId, authHeader);
        setOrder(response.data);
        setOrderStatus(response.data.orderStatus);
      } catch (error) {
        console.error("Error fetching order details:", error);
        if (error.response?.status === 403) {
          toast.warning("You don't have permission to access this order!");
        } else if (error.response?.status === 404) {
          toast.error("Order not found!");
        } else {
          toast.error("You don't have permission to access this order!");
        }
        navigate("/user/orders");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchOrder();
  }, [orderId, authHeader, navigate]);


  const handleConfirmOrder = async () => {
    try {
      const res = await confirmOrder(orderId, authHeader);
      console.log(res);
      setOrderStatus('COMPLETED');
      //  fetch order details
      const updatedOrder = await getOrderById(orderId, authHeader);
      setOrder(updatedOrder.data);

    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Failed to confirm order. Please try again.");
    }
  };

  const handleCancelOrder = async () => { // Renamed for consistency
    try {
      await cancelOrder(orderId, authHeader);
      setOrderStatus("CANCELLED");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const handleReturnOrder = async () => { // NEW: Handle return request
    try {
      const res = await returnOrder(orderId, authHeader);
      console.log(res)
      setOrderStatus('RETURNING'); // Update status to RETURNING
      // Refetch the order to get the updated status
      const updatedOrder = await getOrderById(orderId, authHeader);
      setOrder(updatedOrder.data);
    } catch (error) {
      console.error("Error returning order:", error);
      alert("Failed to request return. Please try again.");
    }
  };

  const handleAddReview = (productId, name, image, item) => {
    setSelectedProduct(productId);
    setSelectedProductDetails({
      productName: name,
      productImage: image,
      variationSingleId: item.variationSingleId,
      customerUserId: order.customerUserId
    });
    console.log()
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
  };

  if (isLoading) {
    return (
        <Backdrop
            sx={(theme) => ({ color: "#8f8f8f", zIndex: theme.zIndex.drawer + 1 })}
            open={true}
        >
          <CircularProgress />
        </Backdrop>
    );
  }

  if (!order) {
    return <div>Error loading order details. Please try again.</div>;
  }

  const handleSubmitReview = async (productId, reviewText) => {
    console.log("Review submitted for product: ", reviewText);

    const review = {
      productId: productId,
      reviewComment: reviewText.reviewComment,
      reviewRating: reviewText.reviewRating,
      userId: reviewText.userId,
      orderId: order.orderId
    };

    try {
      const response = await createReview(review, authHeader);
      console.log("response return: " + response);

      if (response && response.data) {
        setOrder((prevOrder) => {
          const updatedOrderDetails = prevOrder.orderDetails.map((item) => {
            if (item.productId === productId) {
              return {
                ...item,
                reviews: [...(item.reviews || []), review],
              };
            }
            return item;
          });

          return {
            ...prevOrder,
            orderDetails: updatedOrderDetails,
          };
        });

        setOpenReviewModal(false);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  const statusMapping = {
    PENDING: 0,
    PROCESSING: 1,
    SHIPPING: 2,
    COMPLETED: 3,
    CANCELLED: 4,
    RETURNED: 5,
    DENIED: 6,
    RETURNING: 7,
    INSPECTION: 8,
  };

  const statusStep = statusMapping[orderStatus] || 0;

  const totalProductPrice = order.orderDetails.reduce((acc, item) => {
    return acc + (item.unitPrice || 0) * (item.orderQuantity || 0) - (item.discountAmount || 0);
  }, 0);


  const shippingCost = (order.totalAmount || 0) - totalProductPrice;


  return (
      <div className="px-5 py-5 font-poppins">
        <div className="pb-5">
          <Button
              onClick={handleClickBack}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontWeight: "bold",
                textTransform: "none",
              }}
          >
            <FaArrowLeft className="text-2xl text-black" />
            <p className="text-black">Back to Orders</p>
          </Button>
        </div>

        <Card
            sx={{
              p: 3,
              mb: 3,
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
            }}
        >
          <Typography
              variant="h4"
              sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
          >
            Order Details - {order?.trackingNumber}
          </Typography>
          <Box sx={{ py: 3 }}>
            <CustomizedSteppers status={statusStep} />
          </Box>
        </Card>

        <div className="order-summary">
          {order.orderDetails.map((item, index) => (
              <Card
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 3,
                    mb: 3,
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                  }}
              >
                              {/* Product Image */}
                <Box sx={{ marginRight: "20px" }}>
                  <a href={`/shop/product/${item.productId}`} style={{ display: "block" }}>
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    />
                  </a>
                </Box>

                {/* Product Details */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                      variant="h6"
                      sx={{ fontFamily: "Arial", fontWeight: "bold", mb: 1 }}
                  >
                    {item.productName}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Poppins",
                          color: "gray",
                          display: "flex",
                          alignItems: "center",
                        }}
                    >
                  <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                    Color:
                  </span>{" "}
                      {item.color}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "Poppins",
                          color: "gray",
                          display: "flex",
                          alignItems: "center",
                        }}
                    >
                  <span style={{ fontWeight: "bold", marginRight: "5px" }}>
                    Size:
                  </span>{" "}
                      {item.size}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1, backgroundColor: "#e0e0e0" }} />

                  {/* Pricing and Quantity */}
                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                  >
                    <Box>
                      <Typography
                          variant="body1"
                          sx={{ fontFamily: "Poppins", fontWeight: "medium" }}
                      >
                        <span style={{ fontWeight: "bold" }}>Unit Price:</span>{" "}
                        {formatPrice(item.unitPrice)}
                      </Typography>
                      <Typography
                          variant="body1"
                          sx={{ fontFamily: "Poppins", fontWeight: "medium" }}
                      >
                        <span style={{ fontWeight: "bold" }}>Quantity:</span>{" "}
                        {item.orderQuantity}
                      </Typography>
                    </Box>

                    <Box>
                      {item.discountAmount > 0 && (
                          <Typography
                              variant="body1"
                              sx={{
                                fontFamily: "Poppins",
                                fontWeight: "medium",
                                color: "green",
                              }}
                          >
                            <span style={{ fontWeight: "bold" }}>Discount:</span> -{" "}
                            {formatPrice(item.discountAmount)}
                          </Typography>
                      )}
                      <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "Poppins",
                            fontWeight: "bold",
                            color: "#1976d2",
                          }}
                      >
                        <span style={{ fontWeight: "bold" }}>Total Price:</span>{" "}
                        {formatPrice((item.unitPrice || 0) * (item.orderQuantity || 0) - (item.discountAmount || 0))}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Add Review Button */}
                  {orderStatus === "COMPLETED" && !(item.reviews && item.reviews.length > 0) && !item.hasReviewed &&  (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() =>
                                handleAddReview(
                                    item.productId,
                                    item.productName,
                                    item.productImage,
                                    item
                                )
                            }
                            sx={{
                              textTransform: "none",
                              fontFamily: "Montserrat",
                              borderRadius: "30px",
                              fontWeight: "bold",
                            }}
                        >
                          Add Review
                        </Button>
                      </Box>
                  )}
                </Box>
              </Card>
          ))}

          {/* Order Summary */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
                variant="h6"
                sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
            >
              Shipping Fee:
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
              {formatPrice(shippingCost)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
                variant="h6"
                sx={{ fontFamily: "Poppins", fontWeight: "bold" }}
            >
              Total:
            </Typography>
            <Typography variant="h6" sx={{ fontFamily: "Poppins" }}>
              {formatPrice(order.totalAmount)}
            </Typography>
          </Box>

          {/* Action Buttons (Conditional Rendering) */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            {orderStatus === 'SHIPPING' && (
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleConfirmOrder}
                    sx={{ textTransform: 'none', borderRadius: 30, fontFamily: 'Poppins' }}
                >
                  Confirm Receipt
                </Button>
            )}
            {(orderStatus === 'PENDING' || orderStatus === 'PROCESSING') && (
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleCancelOrder}
                    sx={{ textTransform: 'none', borderRadius: 30, fontFamily: 'Poppins' }}
                >
                  Cancel Order
                </Button>
            )}

            {(orderStatus === 'SHIPPING' || orderStatus === 'COMPLETED') && (
                <Button
                    variant="contained"
                    color="warning"
                    onClick={handleReturnOrder}
                    sx={{ textTransform: 'none', borderRadius: 30, fontFamily: 'Poppins' }}
                >
                  Return Order
                </Button>
            )}
          </Box>
        </div>
        <ReviewModal
            open={openReviewModal}
            handleClose={handleCloseReviewModal}
            productId={selectedProduct}
            name={selectedProductDetails?.productName}
            image={selectedProductDetails?.productImage}
            variationSingleId={selectedProductDetails?.variationSingleId}
            userId={selectedProductDetails?.customerUserId}
            orderId={order.orderId}
            handleSubmitReview={handleSubmitReview}
        />
      </div>
  );
}

export default OrderDetail;