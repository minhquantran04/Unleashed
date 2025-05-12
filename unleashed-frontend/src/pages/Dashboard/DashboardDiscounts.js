import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const DashboardDiscounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [discountToDelete, setDiscountToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = useAuthHeader();

  useEffect(() => {
    fetchDiscounts(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchDiscounts = (page, size) => {
    apiClient
      .get(`/api/discounts?page=${page}&size=${size}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setDiscounts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching discounts:", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const openDeleteModal = (discount) => {
    setDiscountToDelete(discount);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = () => {
    apiClient
      .delete(`/api/discounts/${discountToDelete.discountId}`, {
        headers: {
          Authorization: varToken,
        },
      })
      .then(() => {
        fetchDiscounts(currentPage, pageSize);
        handleClose();
        toast.success("Delete discount successfully", {
          position: "bottom-right",
          transition: Zoom,
        });
      })
      .catch(() => {
        toast.error("Delete discount failed", {
          position: "bottom-right",
          transition: Zoom,
        });
      });
  };

  function getStatusColor(discountStatus) {
    switch (discountStatus) {
      case 1:
        return "text-gray-500";
      case 2:
        return "text-green-500";
      case 3:
        return "text-red-500";
      case 4:
        return "text-purple-500";
      default:
        return "";
    }
  }

  function getDiscountTypeName(discountTypeId) { // Function to get discount type name from ID
    switch (discountTypeId) {
      case 1:
        return "Percentage";
      case 2:
        return "Fixed Amount";
      default:
        return "Unknown Type";
    }
  }

  function getDiscountStatusName(discountStatusId) { // Function to get discount status name from ID
    switch (discountStatusId) {
      case 1:
        return "Inactive";
      case 2:
        return "Active";
      case 3:
        return "Expired";
      case 4:
        return "Used";
      default:
        return "Unknown Status";
    }
  }

  function getDiscountRankName(rank) { // Function to get discount status name from ID
    switch (rank) {
      case 1:
        return "Unranked";
      case 2:
        return "Bronze";
      case 3:
        return "Silver";
      case 4:
        return "Gold";
      case 5:
        return "Diamond";
      default:
        return "Unknown Status";
    }
  }

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
            currentPage === i ? "bg-blue-500 text-white" : ""
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Discounts</h1>
        <Link to="/Dashboard/Discounts/Create">
          <button className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> Create Discount
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead className="border border-gray-300">
          <tr>
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Code</th>
            <th className="px-4 py-2 text-left">Type</th>
            <th className="px-4 py-2 text-left">Rank</th>
            <th className="px-4 py-2 text-left">Value</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Usage Limit</th>
            <th className="px-4 py-2 text-left">Usage Count</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
          </thead>
          <tbody>
          {discounts.length > 0 ? (
              discounts.map((discount) => (
                  <tr key={discount.discountId} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{discount.discountId}</td>
                    <td className="px-4 py-2">{discount.discountCode}</td>
                    <td className="px-4 py-2">{getDiscountTypeName(discount.discountType?.id)}</td>
                    <td className="px-4 py-2">{getDiscountRankName(discount.discountRank?.id)}</td> {/* Display discountRank, N/A if null */}
                    <td className="px-4 py-2">
                      {" "}
                      {discount.discountType?.id === 1
                          ? discount.discountValue + "%"
                          : formatPrice(discount.discountValue)}
                    </td>
                    <td
                        className={`px-4 py-2 font-bold ${getStatusColor(
                            discount.discountStatus
                        )}`}
                    >
                      {getDiscountStatusName(discount.discountStatus?.id)}
                    </td>
                    <td className="px-4 py-2">{discount.usageLimit}</td>
                    <td className="px-4 py-2">{discount.usageCount}</td>

                    <td className="px-4 py-2 flex space-x-2 items-center">
                      <Link to={`/Dashboard/Discounts/${discount.discountId}`}>
                        <FaEye className="text-green-500 cursor-pointer"/>
                      </Link>
                      <Link
                          to={`/Dashboard/Discounts/Edit/${discount.discountId}`}
                      >
                        <FaEdit className="text-blue-500 cursor-pointer"/>
                      </Link>
                      {/* Add User to Discount Button */}
                      <Link
                          to={`/Dashboard/Discounts/${discount.discountId}/AddAccount`}
                      >
                        <FaUserPlus
                            className="text-blue-500 cursor-pointer"
                            title="Add User to Discount"
                        />
                      </Link>                    
                          <button
                              className="text-red-500 cursor-pointer"
                              onClick={() => openDeleteModal(discount)}
                          >
                            <FaTrash/>
                          </button>
                    </td>
                  </tr>
              ))
          ) : (
              <p className="text-red-500">No discounts found.</p>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <div>{renderPageNumbers()}</div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleDelete}
        name={discountToDelete?.discountCode || ""}
      />
    </>
  );
};

export default DashboardDiscounts;
