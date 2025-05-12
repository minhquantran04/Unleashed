import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiClient } from "../../core/api";
import { toast, Zoom } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";

const DashboardViewUserDiscount = () => {
  const [discount, setDiscount] = useState(null);
  const [userDiscounts, setUserDiscounts] = useState([]); // Sẽ chứa dữ liệu đã kết hợp
  const [usersData, setUsersData] = useState({}); // Object để lưu trữ thông tin người dùng, key là userId
  const { discountId } = useParams();

  const varToken = useAuthHeader();

  useEffect(() => {
    const fetchDiscountData = async () => {
      try {
        // Fetch discount details
        const discountResponse = await apiClient.get(`/api/discounts/${discountId}`, {
          headers: { Authorization: varToken },
        });
        setDiscount(discountResponse.data);

        // Fetch users who have this discount
        const usersDiscountResponse = await apiClient.get(`/api/discounts/${discountId}/users`, {
          headers: { Authorization: varToken },
        });
        const userDiscountsData = usersDiscountResponse.data.userDiscounts;
        const usersArray = usersDiscountResponse.data.users;

        // Tạo một object usersData để dễ dàng truy cập thông tin người dùng theo userId
        const usersDataObject = {};
        usersArray.forEach(user => {
          usersDataObject[user.userId] = user;
        });
        setUsersData(usersDataObject);

        // Kết hợp dữ liệu userDiscounts và users
        const combinedUserDiscounts = userDiscountsData.map(userDiscount => {
          const userId = userDiscount.id.userId;
          const userDetails = usersDataObject[userId];
          return {
            ...userDiscount,
            user: userDetails
          };
        });
        setUserDiscounts(combinedUserDiscounts);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDiscountData();
  }, [discountId, varToken]);

  // Function to remove user from discount
  const handleRemoveUser = (userId) => {
    apiClient
        .delete(`/api/discounts/${discountId}/users?userId=${userId}`, {
          headers: { Authorization: varToken },
        })
        .then(() => {
          setUserDiscounts((prev) =>
              prev.filter((userDiscount) => userDiscount.user?.userId !== userId) // Sử dụng optional chaining ở đây
          );
          toast.success("User removed from discount", {
            position: "bottom-center",
            transition: Zoom,
          });
        })
        .catch((error) => {
          console.error("Error removing user from discount:", error);
          toast.error("Failed to remove user from discount", {
            position: "bottom-center",
            transition: Zoom,
          });
        });
  };

  function getDiscountTypeName(discountTypeId) {
    switch (discountTypeId) {
      case 1: return "Percentage";
      case 2: return "Fixed Amount";
      default: return "Unknown Type";
    }
  }

  function getDiscountStatusName(discountStatusId) {
    switch (discountStatusId) {
      case 1: return "Inactive";
      case 2: return "Active";
      case 3: return "Expired";
      case 4: return "Used";
      default: return "Unknown Status";
    }
  }

  function getDiscountRankName(rank) {
    switch (rank) {
      case 1: return "Unranked";
      case 2: return "Bronze";
      case 3: return "Silver";
      case 4: return "Gold";
      case 5: return "Diamond";
      default: return "Unknown Status";
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Discount Details</h1>
      </div>

      {/* Discount Information Section */}
      {discount ? (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Discount ID: {discount.discountId}
          </h2>
          <p>Code: {discount.discountCode}</p>
          <p>Type: {getDiscountTypeName(discount.discountType.id)}</p>
          <p>
            Value:{" "}
            {discount.discountType.id === 1
              ? discount.discountValue + "%"
              : formatPrice(discount.discountValue)}
          </p>
          <p>Start Date: {new Date(discount.startDate).toLocaleString()}</p>
          <p>End Date: {new Date(discount.endDate).toLocaleString()}</p>
          <p>Status: {getDiscountStatusName(discount.discountStatus.id)}</p>
          <p>Description: {discount.discountDescription}</p>
          <p>Minimum Order Value: {discount.minimumOrderValue || "null"}</p>
          <p>Maximum Order Value: {discount.maximumDiscountValue || "null"}</p>
          <p>Rank: {getDiscountRankName(discount.discountRank.id)} </p>
          <p>Usage Limit: {discount.usageLimit}</p>
        </div>
      ) : (
        <p>Loading discount details...</p>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Users with Discount</h1>
        <Link to={`/Dashboard/Discounts/${discountId}/AddAccount`}>
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Add Users To Discount
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Full Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Discount Used</th>
            <th className="px-4 py-2 text-left">Remove</th>
          </tr>
          </thead>

          <tbody>
          {userDiscounts.map((userDiscount) => (
              <tr key={userDiscount.id.userId} className="hover:bg-gray-50">
                <td className="px-4 py-2">{userDiscount.user?.username}</td>
                <td className="px-4 py-2">{userDiscount.user?.fullName}</td>
                <td className="px-4 py-2">{userDiscount.user?.email}</td>
                <td className="px-4 py-2">{userDiscount.isDiscountUsed ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  <button
                      onClick={() => handleRemoveUser(userDiscount.id.userId)}
                      className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash/>
                  </button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DashboardViewUserDiscount;
