import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import CategoryDrawer from "../../components/drawer/DashboardCategoryDrawer";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const DashboardCategories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = useAuthHeader();

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/api/categories", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setCategories(response.data.sort((a, b) => a.id - b.id));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      });
  }, [isOpen, isDrawerOpen]);

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = (categoryToDelete) => {
    if (categoryToDelete) {
      apiClient
        .delete(`/api/categories/${categoryToDelete.id}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
          setIsOpen(false);
          toast.success(response.data.message, {
            position: "bottom-right",
            transition: Zoom,
          });
        })
        .catch((error) =>
          toast.error(error.response?.data?.message || "Error deleting category", {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };

  const openDrawer = (category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleEdit = (category) => {
    navigate(`/Dashboard/Categories/Edit/${category.id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Categories</h1>
        {userRole === "ADMIN" && (
          <Link to="/Dashboard/Categories/Create" className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> New category
          </Link>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <table className="table-auto w-full border-collapse">
            <thead className="border border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Category Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Total Quantity</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{category.id}</td>
                    <td className="px-4 py-2">
                      <img src={category.categoryImageUrl} alt={category.categoryName} className="h-12 w-12 object-cover" />
                    </td>
                    <td className="px-4 py-2 max-w-[250px] truncate">{category.categoryName}</td>
                    <td className="px-4 py-2 max-w-[350px] truncate">{category.categoryDescription}</td>
                    <td className="px-4 py-2">{category.totalQuantity}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-left space-x-2">
                        <button onClick={() => openDrawer(category)} className="text-green-500 cursor-pointer">
                          <FaEye />
                        </button>
                        {userRole === "ADMIN" && (
                        <Link to={`/Dashboard/Categories/Edit/${category.id}`}>
                          <FaEdit className="text-blue-500 cursor-pointer" />
                        </Link>
                        )}
                        {userRole === "ADMIN" && (
                          <button onClick={() => openDeleteModal(category)} className="text-red-500 cursor-pointer">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-red-500 py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <DeleteConfirmationModal isOpen={isOpen} onClose={handleClose} onConfirm={() => handleDelete(categoryToDelete)} name={categoryToDelete?.categoryName || ""} />
      <CategoryDrawer isOpen={isDrawerOpen} onClose={closeDrawer} category={selectedCategory || {}} onEdit={handleEdit} onDelete={handleDelete} />
    </>
  );
};

export default DashboardCategories;
