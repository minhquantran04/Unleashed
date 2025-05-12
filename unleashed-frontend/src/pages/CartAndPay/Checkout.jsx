import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
import LocationSelector from "../../service/LocationService";
import { formatPrice } from "../../components/format/formats";
import ShipmentSelector from "../../service/ShipmentService";
import { CommonRadioCard } from "../../components/inputs/Radio";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { checkDiscount, checkoutOrder, getPaymentMethod, getShippingMethod } from "../../service/CheckoutService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast } from "react-toastify";
import { fetchMembership, GetUserInfo } from "../../service/UserService";


const style = {
  py: 0,
  width: "100%",
  maxWidth: "auto",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
};

const CheckoutPage = () => {
  const [location, setLocation] = useState({
    tinh: "",
    quan: "",
    phuong: "",
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState();
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingMethod, setShippingMethod] = useState();
  const { items, isEmpty } = useCart();
  const [discountApply, setDiscountApply] = useState({
    discountType: "",
    discountValue: 0,
    maximumDiscountValue: 0,
  });
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
    username: "",
    fullName: "",
    userAddress: "",
    currentPaymentMethod: "",
    phoneNumber: "",
    userImage: "",
  });
  const [note, setNote] = useState("");
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState("");
  const [discountMinus, setDiscountMinus] = useState(0);
  const [subTT, setSubTT] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const calculateFinalCheckoutPrice = () => {
    return Math.max(0, subTT + shippingFee + (shippingMethod ? shippingMethod.id === 1 ? 20000 : 10000 : 0) - discountMinus - rankDiscount);
  };
  const userState = useAuthUser();
  const authHeader = useAuthHeader();
  const [isCheckoutReady, setIsCheckoutReady] = useState(false);
  const [houseNumber, setHouseNumber] = useState("");
  const [rank, setRank] = useState();
  const [rankDiscount, setRankDiscount] = useState(0);


  //Check if the cart is empty
  useEffect(() => {
    if (isEmpty) {
      navigate(-1);
    }
  }, [isEmpty, navigate]);

  //Fetch Payment methods
  useEffect(() => {
    const fetchPaymentMethod = async () => {
      try {
        await getPaymentMethod(authHeader).then((response) => {
          setPaymentMethods(response.data)
          console.log(response.data);
        })
      } catch (e) {
        toast.error("Failed to fetch payment methods")
      }

    }
    fetchPaymentMethod();
  }, [])

  //Fetch Shipping methods
  useEffect(() => {
    const fetchShippingMethod = async () => {
      try {
        await getShippingMethod(authHeader).then(response => {
          setShippingMethods(response.data)
        })
      } catch (e) {
        toast.error("Failed to fetch shipping methods")
      }
    }
    fetchShippingMethod()
  }, [])

  //Fetch user infor
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await GetUserInfo(authHeader);
        const userInfo = response.data;
        const userInfoData = {
          userId: userInfo.userId || "ID not available",
          email: userInfo.userEmail || "Email not provided",
          username: userInfo.username || "Name not set",
          fullName: userInfo.fullname || "Full name not specified",
          userAddress: userInfo.userAddress === "Address not provided" ? "" : userInfo.userAddress,
          currentPaymentMethod:
            userInfo.userCurrentPaymentMethod ||
            paymentMethods[0],
        };
        setUserData(userInfoData);
      } catch (error) {
        toast.error("Failed to load user data.");
      }
    };
    fetchUserInfo();
  }, [authHeader]);

  //Fetch user rank
  useEffect(() => {
    const fetchRank = async () => {
      const response = await fetchMembership(authHeader, userState.username);
      if (response.data.rankStatus === 1) {
        setRank(response.data.rank)
      }
    }
    fetchRank()
  }, rank);

  useEffect(() => {
    // Ensure this runs only once on mount
    if (userData.userAddress) {
      if (userData.userAddress !== "Address not provided") {
        setHouseNumber(userData.userAddress);
      }
    }
    if (userData.currentPaymentMethod) {
      setPaymentMethod(userData.currentPaymentMethod);
    }
  }, [userData]);


  const handleFeeCalculated = useCallback((fee) => {
    setShippingFee(fee);
  }, []);

  const subTotal = () => {
    const total = items.reduce((accumulator, item) => {
      return accumulator + item.saledPrice * item.quantity;
    }, 0);
    setSubTT(total);
  };

  const rankDiscountAmount = () => {
    setRankDiscount(subTT * (rank ? rank.rankBaseDiscount : 0))
  }

  useEffect(() => {
    if (items.length > 0) {
      const calculatedFinalTotal = calculateFinalCheckoutPrice();
      setFinalTotal(calculatedFinalTotal);
      subTotal();
      rankDiscountAmount();
    }
  }, [items, subTT, shippingFee, discountMinus, shippingMethod, rank]);

  const handleHouseNumberBlur = (e) => {
    setHouseNumber(e.target.value);
    updateShippingAddress(houseNumber, location);
  };

  const handleNoteBlur = (e) => {
    const newNote = e.target.value;
    setNote(newNote);
  };

  const updateShippingAddress = (houseNumber, location) => {
    const fullAddress = `${houseNumber}, ${location.phuong || ""}, ${location.quan || ""
      }, ${location.tinh || ""}`;
    setCheckoutData((prevData) => ({
      ...prevData,
      shippingAddress: fullAddress,
    }));
  };

  const handleLocationChange = useCallback((newLocation) => {
    setLocation(newLocation);
    updateShippingAddress(houseNumber, newLocation); // update with current house number
  }, [houseNumber]);

  const handlePaymentMethodChange = useCallback((e) => {
    const selectedPayment = paymentMethods.find(
      (payment) => payment.id === parseInt(e.target.value, 10)
    );
    if (selectedPayment) {
      setPaymentMethod(selectedPayment);
    } else {
      console.error("Payment method not found");
    }
  }, [paymentMethods]);

  const handleShippingMethodChange = useCallback((e) => {
    const selectedShipping = shippingMethods.find(shipping => shipping.id === parseInt(e.target.value, 10));
    if (selectedShipping) {
      setShippingMethod(selectedShipping);
    } else {
      console.error("Shipping method not found");
    }
  }, [shippingMethods])

  const handleDiscountCheck = async () => {
    try {
      const response = await checkDiscount(discountCode, authHeader, subTT);

      if (response?.data) {
        const discount = {
          discountType: response.data.discountType,
          discountValue: response.data.discountValue,
          maximumDiscountValue: response.data.maximumDiscountValue,
        };

        setDiscountApply(discount);
        const discountAmount = calculateDiscount(subTT, discount);
        setDiscountMinus(discountAmount);
        toast.success("Discount applied successfully!");
      }
      else {
        setDiscountApply({ discountType: "", discountValue: 0, maximumDiscountValue: 0 }); // Clear applied discount on error
        setDiscountMinus(0); // Reset discount minus
        setDiscountCode(""); // Clear discount code input
      }
    } catch (error) {
      console.error("Failed to check discount:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        toast.error("Invalid discount code or not applicable."); // Generic error
      }
      setDiscountApply({ discountType: "", discountValue: 0, maximumDiscountValue: 0 }); // Clear applied discount on error
      setDiscountMinus(0); // Reset discount minus
      setDiscountCode(""); // Clear discount code input
    }
  };

  // Discount calculation function
  const calculateDiscount = (originalPrice, discount) => {
    let discountAmount = 0;

    if (discount.discountType.id === 1) {
      const calculatedDiscount = (originalPrice * discount.discountValue) / 100;
      const maxDiscount = discount.maximumDiscountValue !== null && discount.maximumDiscountValue !== undefined
        ? discount.maximumDiscountValue
        : Infinity;

      discountAmount = Math.min(calculatedDiscount, maxDiscount);
    } else if (discount.discountType.id === 2) {
      discountAmount = discount.discountValue;
    } else if (discount.discountType.id === null) {
      discountAmount = 0;
    }

    return discountAmount;
  };


  // Định nghĩa itemCheckout sau khi tính toán subtotal
  const itemCheckout = items.map((item, index) => ({
    id: item.id,
    image: item.image,
    name: item.name,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.price,
    saledPrice: item.saledPrice,
  }));

  const [checkoutData, setCheckoutData] = useState({
    notes: "",
    discountCode: "",
    discountMinus: 0,
    totalAmount: finalTotal,
    shippingFee: 0,
    orderDetails: [],
    userEmail: userState?.email || "",
    shippingAddress: {
      houseNumber: houseNumber,
      location: location,
    },
    paymentMethod: paymentMethod,
    shippingMethod: shippingMethod
  });

  useEffect(() => {
    // Recalculate the final price and order details whenever there's a change
    const finalCheckoutPrice = calculateFinalCheckoutPrice();

    // Create the updated order details based on the items and discounts applied
    const updatedOrderDetails = items.map((item) => {
      const itemDiscount = calculateItemDiscount(
        item.saledPrice * item.quantity,
        discountApply
      ); // apply discount to each item

      return {
        variationId: item.id,
        orderQuantity: item.quantity,
        unitPrice: item.saledPrice,
        discountAmount: itemDiscount,
      };
    });

    // Create the new checkout data based on updated values
    const newCheckoutData = {
      ...checkoutData,
      orderDetails: updatedOrderDetails, // Updated order details with discount applied
      totalAmount: finalCheckoutPrice, // Updated total with shipping fee and discount
      shippingFee: shippingFee + (shippingMethod ? shippingMethod.id === 1 ? 10000 : 20000 : 0), // Updated shipping fee
      discountMinus: discountMinus, // Updated discount value
      discountCode: discountCode,
      paymentMethod: paymentMethod, // Updated payment method
      shippingMethod: shippingMethod,
      userAddress: (location.phuong && location.quan && location.tinh) ? `${houseNumber}, ${location.phuong || ""}, ${location.quan || ""
        }, ${location.tinh || ""}` : "",
      notes: note,
    };

    // Only update `checkoutData` if there's an actual change
    if (
      newCheckoutData.totalAmount !== checkoutData.totalAmount ||
      newCheckoutData.shippingFee !== checkoutData.shippingFee ||
      newCheckoutData.discountMinus !== checkoutData.discountMinus ||
      JSON.stringify(newCheckoutData.orderDetails) !== JSON.stringify(checkoutData.orderDetails) ||
      newCheckoutData.paymentMethod !== checkoutData.paymentMethod ||
      newCheckoutData.shippingMethod !== checkoutData.shippingMethod ||
      newCheckoutData.shippingAddress !== checkoutData.shippingAddress ||
      newCheckoutData.notes !== checkoutData.notes ||
      newCheckoutData.discountCode !== checkoutData.discountCode ||
      newCheckoutData.userAddress !== checkoutData.userAddress
    ) {
      setCheckoutData(newCheckoutData);
    }
  }, [
    items,
    subTT,
    shippingFee,
    discountMinus,
    discountCode,
    paymentMethod,
    shippingMethod,
    houseNumber,
    location,
    note,
    discountApply,
    rank
  ]);

  const isCheckoutDataComplete = useMemo(() => {
    return (
      (checkoutData.notes.trim().length === 0 ||
        checkoutData.notes.trim().length > 0) &&
      (discountCode.length === 0 || discountCode.length > 0) &&
      checkoutData.totalAmount > 0 &&
      checkoutData.shippingFee > 0 &&
      checkoutData.orderDetails.length > 0 &&
      checkoutData.paymentMethod &&
      checkoutData.shippingMethod &&
      location.tinh && location.quan && location.phuong &&
      houseNumber.trim().length > 0
    );
  }, [
    checkoutData.notes,
    discountCode,
    checkoutData.totalAmount,
    checkoutData.shippingFee,
    checkoutData.orderDetails,
    checkoutData.paymentMethod,
    checkoutData.shippingMethod,
    houseNumber,
  ]);

  useEffect(() => {
    setIsCheckoutReady(isCheckoutDataComplete);
  }, [checkoutData, isCheckoutDataComplete]);

  const calculateItemDiscount = (originalPrice, discount) => {
    let itemDiscount = 0;

    if (originalPrice > 0) {
      itemDiscount = (originalPrice / subTT) * discountMinus;
    }
    return itemDiscount;
  };

  const handlePlaceOrder = async () => {
    const payload = {
      notes: checkoutData.note || checkoutData.notes,
      discountCode: checkoutData.discountCode || null,
      billingAddress: checkoutData.userAddress,
      shippingMethod: checkoutData.shippingMethod,
      totalAmount: checkoutData.totalAmount,
      paymentMethod: checkoutData.paymentMethod,
      userAddress: checkoutData.userAddress,
      orderDetails: checkoutData.orderDetails.map((item) => ({
        variationId: item.variationId,
        orderQuantity: item.orderQuantity,
        unitPrice: item.unitPrice,
        discountAmount: item.discountAmount,
      })),
    };

    try {
      const response = await checkoutOrder(payload, authHeader);
      if (response && response.data) {
        console.log(response.data.redirectUrl);

        if (response.data.redirectUrl) {
          localStorage.setItem("orderId", response.data.orderId);
          window.location.href = response.data.redirectUrl;
        } else {
          if (paymentMethod.paymentMethodName === "TRANSFER") {
            localStorage.setItem("orderId", response.data.orderId);
            navigate("/orders/bankTransfer?total=" + checkoutData.totalAmount);
          } else {
            localStorage.setItem("orderId", response.data.orderId);
            navigate("/orders/success");
          }
        }
      }
    } catch (error) {
      console.error("Order placement failed:", error);
    }
  };

  const handlePaymentMethodName = (paymentName) => {
    switch (paymentName) {
      default:
        return null;
      case "COD":
        return "Cash on Delivery";
      case "VNPAY":
        return "Payment via VNPay";
      case "TRANSFER":
        return "Bank Transfer";
    }
  }

  const handlePaymentMethodDes = (paymentName) => {
    switch (paymentName) {
      default:
        return null;
      case "COD":
        return "Pay for your order in cash when it is delivered to your doorstep.";
      case "VNPAY":
        return "Use VNPay to pay via QR code, ensuring a fast and reliable payment experience.";
      case "TRANSFER":
        return "Transfer the total amount to our bank account prior to delivery.";
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-items-center">
      <div className="checkoutInfomation w-full">
        <div className="bgCartItem bg-gray-100 md:px-9">
          <div className="checkoutHeader md:p-10 flex justify-start items-center font-poppins">
            <p className="font-semibold text-2xl">Your Order</p>
          </div>
          <List sx={style}>
            {itemCheckout.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemIcon>
                    <Badge
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#7ECCFA", // Background color
                          color: "white",
                        },
                      }}
                      badgeContent={item.quantity}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-24 max-h-24 rounded-lg"
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText sx={{ px: "10px" }}>
                    <p className="font-poppins font-semibold text-lg md:text-xl">
                      {item.name}
                    </p>
                    <span>Size: </span>
                    <span className="font-semibold font-poppins">
                      {item.size}
                    </span>
                    <span className="px-2">|</span>
                    <span>Color: </span>
                    <span className="font-semibold font-poppins">
                      {item.color}
                    </span>
                  </ListItemText>
                  <ListItemText sx={{ placeItems: "end" }}>
                    {item.price > item.saledPrice ? (
                      <>
                        <p>{formatPrice(item.saledPrice)}</p>
                        <p className="line-through text-red-500">
                          {formatPrice(item.price)}
                        </p>
                      </>
                    ) : (
                      <span>{formatPrice(item.price)}</span>
                    )}
                  </ListItemText>
                  <ListItemText sx={{ px: "10px" }}>
                    X {item.quantity}
                  </ListItemText>
                </ListItem>

                <Divider />
              </React.Fragment>
            ))}
          </List>
          <p className="font-poppins font-semibold text-xl py-5">
            Discount Code
          </p>
          <TextField
            variant="outlined"
            fullWidth
            disabled={discountApply.discountType.length > 0}
            onBlur={(e) => setDiscountCode(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={handleDiscountCheck}
                    sx={{ height: "100%", color: "green" }}
                    disabled={discountApply.discountType.length > 0}
                  >
                    {discountApply.discountType.length > 0
                      ? "Applied"
                      : "Apply"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Divider sx={{ py: '15px' }} />
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '24px',
            }}
          >
            <Box sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: '16px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                Order Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                  Subtotal
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '600', color: '#374151' }}>
                  {formatPrice(subTT)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <ShipmentSelector
                  provinceName={location.tinh}
                  onFeeCalculated={handleFeeCalculated} />
                <Typography variant="body1" sx={{ color: '#6b7280' }}>
                  Shipping Cost
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: '600', color: '#374151' }}>
                  {formatPrice(shippingFee + (shippingMethod ? shippingMethod.id === 1 ? 20000 : 10000 : 0))}
                </Typography>
              </Box>
              {rank && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Membership ({rank.rankName})
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '600', color: '#16a34a' }}>
                    - {formatPrice(rankDiscount)}
                  </Typography>
                </Box>
              )}
              {discountMinus > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <Typography variant="body1" sx={{ color: '#6b7280' }}>
                    Coupon Discount
                    {discountApply.discountType === 'PERCENTAGE'
                      ? ` (${discountApply.discountValue}%)`
                      : ''}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: '600', color: '#16a34a' }}>
                    - {formatPrice(discountMinus)}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ paddingTop: '16px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#374151' }}>
                  Total
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'red' }}>
                  {formatPrice(finalTotal)}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ py: '15px' }} />
        </div>
      </div>
      <div className="cartTotal w-full px-10">
        <div className="infomationHeader font-poppins text-2xl text-center font-bold">
          <h1>Your Infomation</h1>
        </div>
        <div className="userInfomation">
          <p className="font-poppins font-semibold text-2xl pt-3">Email</p>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Your email address"
            value={userData?.email?.length > 0 ? userData?.email : ""}
            disabled={userData?.email?.length > 0 ? true : false}
          // onChange={}
          />
        </div>
        <div className="BillingAddress font-poppins space-y-5">
          <p className=" font-semibold text-2xl pt-3">Billing Address</p>
          <LocationSelector onLocationChange={handleLocationChange} initialAddress={userData.userAddress} />
          <TextField
            variant="outlined"
            fullWidth
            placeholder="House number, village"
            value={houseNumber}
            onBlur={handleHouseNumberBlur}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
        </div>
        <div className="Payment pt-3 space-y-3">
          <p className=" font-poppins font-semibold text-2xl">Payments</p>
          {paymentMethods.map(payment =>
            <CommonRadioCard
              value={payment.id}
              label={handlePaymentMethodName(payment.paymentMethodName)}
              checked={paymentMethod?.id === payment?.id}
              onChange={handlePaymentMethodChange}
              description={handlePaymentMethodDes(payment.paymentMethodName)}
            />
          )}
          <p className=" font-poppins font-semibold text-2xl">Shipping</p>
          {shippingMethods.map(shipping =>
            <CommonRadioCard
              value={shipping.id}
              label={shipping.shippingMethodName}
              checked={shippingMethod?.id === shipping?.id}
              onChange={handleShippingMethodChange}
              description=""
            />
          )}
        </div>
        <div className="note py-5">
          <p className="font-poppins font-semibold text-2xl pt-3">Note</p>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Any special request?"
            onBlur={handleNoteBlur}
            multiline
          />
        </div>
        <div className="btnCheckout flex justify-end pb-3">
          <Button
            onClick={handlePlaceOrder}
            disabled={!isCheckoutReady}
            sx={{
              backgroundColor: isCheckoutReady && "black",
              color: !isCheckoutReady ? "gray" : "white", // Set text color to gray when disabled
              borderRadius: "10px",
              textTransform: "none",
            }}
          >
            {isCheckoutReady
              ? `Pay ${formatPrice(finalTotal)}`
              : "Please complete the information"}
          </Button>
        </div>
      </div>
    </div>

  );
};
export default CheckoutPage;
