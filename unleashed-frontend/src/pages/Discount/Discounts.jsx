import { Backdrop, CircularProgress, Grid2 } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";
import { useEffect, useState, useCallback } from "react";
import { getMyDiscount } from "../../service/UserService";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";
import { Link } from 'react-router-dom';

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authHeader = useAuthHeader();

  const [currentTime, setCurrentTime] = useState(new Date()); // Thêm state để kích hoạt re-render

  // Memoized format function - giữ lại vì vẫn hữu ích cho việc format
  const formatRemainingTime = useCallback((endDate) => { // Nhận endDate thay vì remainingTime
    const remainingTime = new Date(endDate) - currentTime; // Tính toán dựa trên currentTime
    if (remainingTime <= 0) return "Expired";

    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m `;
  }, [currentTime]);

  useEffect(() => {
    const fetchDiscounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyDiscount(authHeader);
        if (response && response.data) {
          const discountData = response.data;
          // Calculate remainingTime only once here
          setDiscounts(
              discountData.map((discount) => ({
                ...discount,
           //     remainingTime: new Date(discount.endDate) - new Date(),
              }))
          );
        } else {
          setDiscounts([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();

    // Thêm setInterval để cập nhật currentTime mỗi giây
    const intervalId = setInterval(() => {
      setCurrentTime(new Date()); // Cập nhật currentTime để kích hoạt re-render
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup interval khi component unmount

  }, [authHeader]); // Dependency array still includes authHeader

  function getStatusColor(discountStatusId) {
    const discountStatus = discounts.find(d => d.discountStatus.id === discountStatusId)?.discountStatus?.discountStatusName;
    switch (discountStatus) {
      case "Inactive":
        return "text-gray-500";
      case "Active":
        return "text-green-500";
      case "Expired":
        return "text-red-500";
      case "Used":
        return "text-purple-500";
      default:
        return "";
    }
  }

  function getDiscountTypeName(discountTypeId) {
    const discountType = discounts.find(d => d.discountType?.id === discountTypeId)?.discountType?.discountTypeName;
    switch (discountType) {
      case "PERCENTAGE":
        return "Percentage";
      case "FIXED_AMOUNT":
        return "Fixed Amount";
      default:
        return "Unknown Type";
    }
  }

  function getDiscountStatusName(discountStatusId) {
    const discountStatus = discounts.find(d => d.discountStatus?.id === discountStatusId)?.discountStatus?.discountStatusName;
    switch (discountStatus) {
      case "INACTIVE":
        return "Inactive";
      case "ACTIVE":
        return "Active";
      case "EXPIRED":
        return "Expired";
      case "Used":
        return "Used";
      default:
        return "Unknown Status";
    }
  }

  function getDiscountRankName(discountRankId) {
    const discountRank = discounts.find(d => d.discountRank?.id === discountRankId)?.discountRank?.rankName;
    switch (discountRank) {
      case "Unranked":
        return "Unranked";
      case "Bronze":
        return "Bronze";
      case "Silver":
        return "Silver";
      case "Gold":
        return "Gold";
      case "Diamond":
        return "Diamond";
      default:
        return "All Ranks"; // Or "N/A" or "Any Rank" as per your requirement if rank is null
    }
  }


  return (
      <Grid2 container>
        {/* UserSideMenu is displayed immediately */}
        <Grid2 size={4}>
          <UserSideMenu />
        </Grid2>

        {/* Main content: Discount table */}
        <Grid2 size={8} className="p-4">
          <h1 className="text-2xl font-bold mb-4">My Discounts</h1>
          {loading ? (
              <Backdrop
                  sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
                  open={loading}
              >
                <CircularProgress />
              </Backdrop>
          ) : error ? (
              <p>Error loading discounts: {error.message}</p>
          ) : discounts.length === 0 ? (
              <p>No discounts available.</p>
          ) : (
              <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                  <thead className="border border-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Value</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Usage Limit</th>
                    <th className="px-4 py-2 text-left">Times Used</th>
                    <th className="px-4 py-2 text-left">Expiry</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                  </thead>
                  <tbody>
                  {discounts.map((discount) => (
                      <tr key={discount.discountId} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{discount.discountCode}</td>
                        <td className="px-4 py-2">{getDiscountTypeName(discount.discountType?.id)}</td>
                        <td className="px-4 py-2">{getDiscountRankName(discount.discountRank?.id)}</td>
                        <td className="px-4 py-2">
                          {discount.discountType?.id === 1
                              ? discount.discountValue + "%"
                              : formatPrice(discount.discountValue)}
                        </td>
                        <td
                            className={`px-4 py-2 font-bold ${getStatusColor(discount.discountStatus?.id)}`}
                        >
                          {getDiscountStatusName(discount.discountStatus?.id)}
                        </td>
                        <td className="px-4 py-2">{discount.usageLimit}</td>
                        <td className="px-4 py-2">{discount.usageCount}</td>
                        <td className="px-4 py-2">{formatRemainingTime(discount.endDate)}</td>
                        <td className="px-4 py-2">
                          <Link to={`/user/discounts/${discount.discountId}`}>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                              View Detail
                            </button>
                          </Link>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </Grid2>
      </Grid2>
  );
};

export default DiscountPage;