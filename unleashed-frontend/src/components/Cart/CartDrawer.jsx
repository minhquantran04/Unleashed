import React, { useEffect, useRef, useState } from "react";
import { useCart } from "react-use-cart"; // Import from react-use-cart
import {
  Drawer,
  List,
  ListItem,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { Drawerbtn } from "../buttons/Button";
import { formatPrice } from "../format/formats";
import { MdAdd, MdCancel, MdRemove } from "react-icons/md";
import { addToCart, fetchUserCart, removeAllFromCart, removeFromCart } from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const CartDrawer = ({ isCartOpen, toggleCartDrawer }) => {
  const [isLoading, setIsLoading] = useState(true); // If using react
  const drawerRef = useRef(null);
  const isCartFetched = useRef(false);
  const [total, setTotal] = useState(0);
  const {
    isEmpty,
    items,
    removeItem,
    emptyCart,
    cartTotal,
    updateItemQuantity,
    addItem,
    updateItem,
    getItem,
    inCart
  } = useCart();

  const authHeader = useAuthHeader();
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (drawerRef.current && !drawerRef.current.contains(event.target)) {
      toggleCartDrawer(false)();
    }
  };
  const handleRemovefromCart = async (item) => {
    await removeFromCart(authHeader, item.id)
    removeItem(item.id)
  }
  const handleClearAll = async () => {
    await removeAllFromCart(authHeader)
    emptyCart();
  };

  const handleIncrease = async (item) => {
    if (item.quantity < item.maxQuantity) {
      await addToCart(authHeader, item.id, + 1)
      updateItemQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      await addToCart(authHeader, item.id, - 1)
      updateItemQuantity(item.id, item.quantity - 1);
    }
  };
  const fetchCart = async () => {
    if (isCartFetched.current) {
      return; // Prevent multiple calls
    }
    isCartFetched.current = true;
    setIsLoading(true);
    try {
      const response = await fetchUserCart(authHeader);
      if (response && response.data && Object.keys(response.data).length > 0) {
        const processedIds = new Set(); // Track processed IDs
        for (const [productName, datas] of Object.entries(response.data)) {
          const promises = datas.map(async (data) => {
            const cartItem = {
              id: data.variation.id,
              name: productName,
              color: data.variation.color.colorName,
              size: data.variation.size.sizeName,
              image: data.variation.variationImage,
              price: data.variation.variationPrice,
              maxQuantity: data.stockQuantity,
              saledPrice: data.sale ? data.sale.saleType.id === 1 ? data.variation.variationPrice - Math.round(data.variation.variationPrice * (data.sale.saleValue / 100))
                : data.variation.variationPrice - data.sale.saleValue
                : data.variation.variationPrice
            }

            if (!processedIds.has(cartItem.id)) { // Check if ID is processed
              processedIds.add(cartItem.id); // Mark ID as processed
              if (getItem(cartItem.id) === undefined) {
                addItem(cartItem, data.quantity);
              } else {
                updateItemQuantity(cartItem.id, data.quantity);
              }
            }
          });
          await Promise.all(promises);
        }
      } else {
        emptyCart();
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      emptyCart();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart()
  }, [])

  useEffect(() => {
    let total = 0
    items.map(item => total += item.saledPrice * item.quantity)
    setTotal(total)
  }, [items])
  useEffect(() => {
    if (isCartOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleClickCheckout = () => {
    toggleCartDrawer(false)();
    navigate("/checkout");
  };

  return (
    isLoading ?
      <div>Loading cart...</div>
      :
      <Drawer
        anchor="right"
        open={isCartOpen}
        role="presentation"
        onClose={() => toggleCartDrawer(false)}
        PaperProps={{
          sx: { width: "25%", padding: "15px" },
        }}
      >
        <div ref={drawerRef} className="p-10">
          <Typography
            variant="h5"
            className="font-bold"
            gutterBottom
            fontFamily="Poppins"
          >
            Shopping Cart
          </Typography>

          {isEmpty ? (
            <Typography variant="body1" fontFamily="Poppins">
              Your cart is empty.
            </Typography>
          ) : (
            <List>
              {items.map((item) => (
                <ListItem
                  key={`${item.id}-${item.variationId}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0",
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={item.image} // Assuming item has an image property
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginRight: "15px",
                    }}
                  />
                  <Box>
                    {/* Product Name */}
                    <Typography
                      variant="body1"
                      color="text.primary"
                      fontFamily="Poppins"
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Poppins"
                    >
                      {item.color} - {item.size}
                    </Typography>
                    {/* Quantity and Price */}
                    <Box display="flex" alignItems="center" mt={1}>
                      <IconButton
                        onClick={() => handleDecrease(item)}
                        disabled={item.quantity <= 1}
                        size="small"
                      >
                        <MdRemove />
                      </IconButton>
                      <Typography variant="body2" mx={1}>
                        {item.quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleIncrease(item)}
                        disabled={item.quantity >= item.maxQuantity}
                        size="small"
                      >
                        <MdAdd />
                      </IconButton>
                    </Box>
                    {/* Quantity and Price */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontFamily="Poppins"
                    >
                      {item.quantity} x
                      &nbsp;
                      {item.price !== item.saledPrice && ( // Conditional rendering
                        <span style={{ textDecoration: 'line-through', color: 'red' }}>
                          {formatPrice(item.price)}
                        </span>
                      )}
                      &nbsp;
                      <strong>{formatPrice(item.saledPrice)}</strong>
                    </Typography>
                  </Box>

                  {/* Remove Item Button */}
                  <Button
                    onClick={() => handleRemovefromCart(item)}
                    size="small"
                    color="secondary"
                    sx={{ marginLeft: "auto" }}
                  >
                    <Typography variant="body2">
                      <MdCancel />
                    </Typography>
                  </Button>
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Subtotal and Checkout */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="body1"
              color="text.primary"
              fontWeight="bold"
              fontFamily="Poppins"
            >
              Subtotal
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              fontWeight="bold"
              fontFamily="Poppins"
            >
              {formatPrice(total)}
            </Typography>
          </Box>

          {/* Checkout Buttons */}
          <Box
            display="flex"
            justifyContent="space-between"
            marginTop="16px"
            sx={{
              gap: "16px",
            }}
          >
            <Drawerbtn
              context={"Clear All"}
              handleClick={handleClearAll}
              isEmpty={isEmpty}
            />
            <Drawerbtn
              context={"Checkout"}
              handleClick={handleClickCheckout}
              isEmpty={isEmpty}
            />
          </Box>
        </div>
      </Drawer>
  );
};

export default CartDrawer;
