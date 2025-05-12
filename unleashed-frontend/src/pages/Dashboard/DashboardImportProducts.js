import React, { useEffect, useState } from "react";
import { apiClient } from "../../core/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast, Zoom } from "react-toastify";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const DashboardImportProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedVariations, setSelectedVariations] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [showProviderModal, setShowProviderModal] = useState(false); // Control modal visibility
    const [selectedProviderId, setSelectedProviderId] = useState(null); // Store selected provider

    const authUser = useAuthUser();
    const username = authUser.username;
    const varToken = useAuthHeader();
    const { stockId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        apiClient
            .get("/api/products", { headers: { Authorization: varToken } })
            .then((response) => setProducts(response.data))
            .catch((error) => console.error("Error fetching products:", error));

        apiClient
            .get("/api/brands", { headers: { Authorization: varToken } })
            .then((response) => setBrands(response.data))
            .catch((error) => console.error("Error fetching brands:", error));

        apiClient
            .get("/api/categories", { headers: { Authorization: varToken } })
            .then((response) => setCategories(response.data))
            .catch((error) => console.error("Error fetching categories:", error));

        apiClient
            .get("/api/providers", { headers: { Authorization: varToken } })
            .then((response) => setProviders(response.data))
            .catch((error) => console.error("Error fetching providers:", error));
    }, [varToken]);

    useEffect(() => {
        setFilteredProducts(
            products.filter((product) => {
                const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesBrand = selectedBrand ? product.brandName.toLowerCase().trim() === selectedBrand.toLowerCase().trim() : true;
                const matchesCategory = !selectedCategory ? true : product.categoryList.some(cat =>
                    cat.categoryName.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
                );
                return matchesSearch && matchesBrand && matchesCategory;
            })
        );
    }, [products, searchTerm, selectedBrand, selectedCategory]);

    const handleVariationChange = (variationId, quantity) => {
        setSelectedVariations((prev) => {
            const updatedVariations = { ...prev };
            if (quantity > 0) {
                updatedVariations[variationId] = parseInt(quantity);
            } else {
                delete updatedVariations[variationId];
            }
            return updatedVariations;
        });
    };


    const handleImportFromProvider = (providerId) => {
        setSelectedProviderId(providerId);
        setShowProviderModal(false); // Close modal after selection

        const variations = Object.entries(selectedVariations)
            .filter(([variationId, quantity]) => !isNaN(parseInt(variationId)) && parseInt(variationId) > 0 && quantity > 0)
            .map(([variationId, quantity]) => ({
                productVariationId: parseInt(variationId),
                quantity,
            }));

        const payload = {
            stockId,
            username,
            variations,
            providerId: providerId, // Include providerId in the payload
        };

        apiClient.post("/api/stock-transactions", payload, {
            headers: {
                Authorization: varToken,
            },
        })
            .then((response) => {
                toast.success("Import successfully", {
                    position: "bottom-right",
                    transition: Zoom,
                });
                navigate(`/Dashboard/Warehouse/${stockId}`);
            })
            .catch((error) => {
                toast.error("Import failed", {
                    position: "bottom-right",
                    transition: Zoom,
                });
            });
    };

    const openProviderModal = () => {
        // Check if variations are selected before opening the modal
        if (Object.keys(selectedVariations).length === 0) {
            toast.warn("Please select at least one variation before importing.", {
                position: "bottom-right",
                transition: Zoom,
            });
            return; // Prevent opening the modal
        }
        setShowProviderModal(true);
    }

    const closeModal = () => {
        setShowProviderModal(false);
    }


    return (
        <div className="p-5 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Import Products into Stock #{stockId}</h1>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by product name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border rounded-md"
                />
                <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                        <option key={brand.brandId} value={brand.brandName}>{brand.brandName}</option>
                    ))}
                </select>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.categoryId} value={category.categoryName}>{category.categoryName}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                    <ProductCard
                        key={product.productId}
                        product={product}
                        onVariationChange={handleVariationChange}
                        selectedVariations={selectedVariations}
                    />
                ))}
            </div>

            <button
                onClick={openProviderModal} // Open modal on click
                className="block mt-8 mx-auto px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-200"
            >
                Import
            </button>

            {/* Provider Selection Modal */}
            {showProviderModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h2 className="text-2xl font-bold mb-4">Select a Provider</h2>
                        <button onClick={closeModal} className="absolute top-2 right-2 text-xl">×</button>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {providers.map((provider) => (
                                <tr key={provider.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img src={provider.providerImageUrl} alt={provider.providerName} className="h-10 w-10 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{provider.providerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleImportFromProvider(provider.id)}
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Import
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </div>
    );
};



const ProductCard = ({ product, onVariationChange, selectedVariations }) => {
    const [variations, setVariations] = useState([]);
    const varToken = useAuthHeader();

    useEffect(() => {
        apiClient
            .get(`/api/products/${product.productId}/product-variations`, {
                headers: {
                    Authorization: varToken,
                },
            })
            .then((response) => {
                const variationsData = response.data;
                setVariations(variationsData || []);
            })
            .catch((error) => console.error("Error fetching variations:", error));
    }, [product.productId, varToken]);

    return (
        <div
            className="p-6 border rounded-lg shadow-sm bg-white hover:shadow-lg transition duration-200 flex flex-col justify-between"
            style={{ minWidth: "330px" }}
        >
            <div>
                <div className="flex items-center mb-4">
                    <img
                        src={product.productVariationImage}
                        alt={product.productName}
                        className="w-20 h-20 rounded-lg shadow mr-4 object-cover"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{product.productName}</h2>
                        <p className="text-sm text-gray-600">Brand: {product.brandName}</p>
                        <p className="text-sm text-gray-600">
                            Category: {product.categoryList && product.categoryList[0] ? product.categoryList[0].categoryName : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600">
                            Price: {product.productPrice.toLocaleString()} VND
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t"></div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                    {variations.map((variation) => (
                        <VariationCard
                            key={variation.id}
                            variation={variation}
                            onVariationChange={onVariationChange}
                            isSelected={selectedVariations[variation.id] > 0}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const VariationCard = ({ variation, onVariationChange, isSelected }) => {
    const [quantity, setQuantity] = useState(0);
    const [showInput, setShowInput] = useState(false);

    const handleCardClick = () => {
        if (!showInput) {
            setShowInput(true);
            setQuantity(quantity || 1);
            onVariationChange(variation.id, quantity || 1);
        } else {
            setShowInput(false);
            onVariationChange(variation.id, 0);
            setQuantity(0);
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        const parsedValue = parseInt(value, 10) || 0;
        if (value === "0" || parsedValue === 0) {
            setQuantity("");
            onVariationChange(variation.id, 0);
        } else {
            setQuantity(parsedValue);
            onVariationChange(variation.id, parsedValue);
        }
    };

    return (
        <div
            className={`p-2 rounded-lg border text-center shadow-sm cursor-pointer transition duration-200 flex flex-col justify-between ${isSelected ? "border-green-500 bg-green-50" : "bg-gray-50"}`}
            onClick={handleCardClick}
            style={{ minWidth: "90px", maxWidth: "110px", height: "100%"}}
        >
            <div>
                <img
                    src={variation.variationImage}
                    alt={`${variation.size?.sizeName} ${variation.color?.colorName}`}
                    className="w-full h-16 rounded-lg object-cover mb-1"
                />
                <p className="text-xs font-medium text-gray-700">
                    Size: {variation.size?.sizeName}
                </p>
                <p className="text-xs font-medium text-gray-700">
                    Color: {variation.color?.colorName}
                </p>
            </div>

            {showInput && (
                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleQuantityChange}
                    placeholder="Quantity"
                    className="mt-1 w-full p-1 border rounded focus:outline-none focus:ring focus:ring-green-200"
                />
            )}
        </div>
    );
};

export default DashboardImportProducts;