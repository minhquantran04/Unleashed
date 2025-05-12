import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import BrandDrawer from "../../components/drawer/DashboardBrandDrawer";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const DashboardBrands = () => {
  const [brands, setBrands] = useState([]);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const authUser = useAuthUser();
  const userRole = authUser?.role;
  const varToken = useAuthHeader();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await apiClient.get("/api/brands", {
        headers: { Authorization: varToken },
      });

      if (Array.isArray(response.data)) {
        setBrands(response.data.sort((a, b) => a.brandId - b.brandId));
      } else {
        setBrands([]);
      }
    } catch (error) {
      toast.error("Error fetching brands", { position: "bottom-right", transition: Zoom });

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = (brand) => {
    setBrandToDelete(brand);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;

    setIsDeleting(true);
    try {
      const response = await apiClient.delete(`/api/brands/${brandToDelete.brandId}`, {
        headers: { Authorization: varToken },
      });

      toast.success(response.data, { position: "bottom-right", transition: Zoom });
      setBrands((prev) => prev.filter((b) => b.brandId !== brandToDelete.brandId));
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data || "Failed to delete brand.", { position: "bottom-right", transition: Zoom });
    } finally {
      setIsDeleting(false);
    }
  };

  const openDrawer = (brand) => {
    setSelectedBrand(brand);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (brand) => {
    navigate(`/Dashboard/Brands/Edit/${brand.brandId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Brands</h1>
        {userRole === "ADMIN" && (
          <Link to="/Dashboard/Brands/Create" className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> New brand
          </Link>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse">
            <thead className="border border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Logo</th>
                <th className="px-4 py-2 text-left">Website</th>
                <th className="px-4 py-2 text-left">Brand Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Total Quantity</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                brands.map((brand) => (
                  <tr key={brand.brandId} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{brand.brandId}</td>
                    <td className="px-4 py-2">
                      <img src={brand.brandImageUrl} alt={brand.brandName} className="h-12 w-12 object-cover" />
                    </td>
                    <td className="px-4 py-2 max-w-[250px] truncate">
                      <a
                        href={brand.brandWebsiteUrl.startsWith('http') ? brand.brandWebsiteUrl : `https://${brand.brandWebsiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {brand.brandWebsiteUrl}
                      </a>
                    </td>
                    <td className="px-4 py-2 max-w-[200px] truncate">{brand.brandName}</td>
                    <td className="px-4 py-2 max-w-[300px] truncate">{brand.brandDescription}</td>
                    <td className="px-4 py-2">{brand.totalQuantity}</td>
                    <td className="px-4 py-2 flex space-x-2 pt-6">
                      <button onClick={() => openDrawer(brand)} className="text-green-500 cursor-pointer">
                        <FaEye />
                      </button>
                      {userRole === "ADMIN" && (
                        <Link to={`/Dashboard/Brands/Edit/${brand.brandId}`}>
                          <FaEdit className="text-blue-500 cursor-pointer" />
                        </Link>
                      )}
                      {userRole === "ADMIN" && (
                        <button onClick={() => openDeleteModal(brand)} className="text-red-500 cursor-pointer" disabled={isDeleting}>
                          {isDeleting ? "..." : <FaTrash />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-red-500 py-4">
                    No brands found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDelete} name={brandToDelete?.brandName || ""} />

      <BrandDrawer isOpen={isDrawerOpen} onClose={closeDrawer} brand={selectedBrand || {}} onEdit={handleEdit} onDeleteSuccess={fetchBrands} />
    </>
  );
};

export default DashboardBrands;
