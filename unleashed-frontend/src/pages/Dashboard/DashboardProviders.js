import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import ProviderDrawer from "../../components/drawer/DashboardProviderDrawer";
import { apiClient } from "../../core/api";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

const DashboardProviders = () => {
  const [providers, setProviders] = useState([]);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const authUser = useAuthUser();
  const userRole = authUser.role;
  const varToken = useAuthHeader();

  useEffect(() => {
    setIsLoading(true);
    apiClient
      .get("/api/providers", {
        headers: {
          Authorization: varToken,
        },
      })
      .then((response) => {
        setProviders(response.data.sort((a, b) => a.id - b.id));
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
      })
      .finally(() => setIsLoading(false));
  }, [isOpen, isDrawerOpen]);

  const openDeleteModal = (provider) => {
    setProviderToDelete(provider);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDelete = (providerToDelete) => {
    if (providerToDelete) {
      apiClient
        .delete(`/api/providers/${providerToDelete.id}`, {
          headers: {
            Authorization: varToken,
          },
        })
        .then((response) => {
          setProviders(providers.filter((p) => p.id !== providerToDelete.id));
          setIsOpen(false);
          toast.success(response.data, {
            position: "bottom-right",
            transition: Zoom,
          });
        })
        .catch((error) =>
          toast.error(error.response?.data || "Error deleting provider", {
            position: "bottom-right",
            transition: Zoom,
          })
        );
    }
  };
  

  const openDrawer = (provider) => {
    setSelectedProvider(provider);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold mb-6">Providers</h1>
        {userRole === "ADMIN" && (
          <Link to="/Dashboard/Providers/Create" className="text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center">
            <FaPlus className="mr-2" /> New provider
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
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.length > 0 ? (
                providers.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{provider.id}</td>
                    <td className="px-4 py-2">
                      <img src={provider.providerImageUrl} alt={provider.providerName} className="h-12 w-12 object-cover" />
                    </td>
                    <td className="px-4 py-2 max-w-[250px] truncate">{provider.providerName}</td>
                    <td className="px-4 py-2 max-w-[250px] truncate">{provider.providerEmail}</td>
                    <td className="px-4 py-2">{provider.providerPhone}</td>
                    <td className="px-4 py-2 max-w-[250px] truncate">{provider.providerAddress}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-left space-x-2">
                        <button onClick={() => openDrawer(provider)} className="text-green-500 cursor-pointer">
                          <FaEye />
                        </button>
                        {userRole === "ADMIN" && (
                        <Link to={`/Dashboard/Providers/Edit/${provider.id}`}>
                          <FaEdit className="text-blue-500 cursor-pointer" />
                        </Link>
                        )}
                        {userRole === "ADMIN" && (
                          <button onClick={() => openDeleteModal(provider)} className="text-red-500 cursor-pointer">
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-red-500 py-4">
                    No providers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DeleteConfirmationModal isOpen={isOpen} onClose={handleClose} onConfirm={() => handleDelete(providerToDelete)} name={providerToDelete?.providerName || ""} />

      <ProviderDrawer isOpen={isDrawerOpen} onClose={closeDrawer} provider={selectedProvider || {}} />
    </>
  );
};

export default DashboardProviders;
