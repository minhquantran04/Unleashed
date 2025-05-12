import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams và Link
import { getMyDiscount } from "../../service/UserService"; // Import service để fetch discount detail (nếu cần API riêng)
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { formatPrice } from "../../components/format/formats";
import { Grid2, CircularProgress, Backdrop } from "@mui/material";
import UserSideMenu from "../../components/menus/UserMenu";

const DiscountDetailPage = () => {
    const { discountId } = useParams(); // Lấy discountId từ URL params
    const [discountDetail, setDiscountDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const authHeader = useAuthHeader();

    useEffect(() => {
        const fetchDiscountDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                // **TODO: Thay getMyDiscount bằng API endpoint để lấy chi tiết discount theo ID**
                // Ví dụ: Nếu bạn có API endpoint là `/api/discounts/{discountId}`
                // const response = await apiClient.get(`/api/discounts/${discountId}`, { headers: { Authorization: authHeader } });
                // setDiscountDetail(response.data);

                // **Tạm thời dùng lại getMyDiscount (có thể không hiệu quả nếu API này trả về list)**
                const response = await getMyDiscount(authHeader); // **Có thể cần API khác chuyên biệt hơn**
                if (response && response.data) {
                    // Tìm discount trong list trả về có discountId trùng với params
                    const foundDiscount = response.data.find(discount => discount.discountId === parseInt(discountId));
                    setDiscountDetail(foundDiscount);
                } else {
                    setError("Discount not found");
                }


            } catch (err) {
                setError(err.message || "Failed to load discount detail");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscountDetail();
    }, [discountId, authHeader]);

    if (loading) {
        return (
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (error || !discountDetail) {
        return <p>Error loading discount detail: {error || "Discount not found"}</p>;
    }


    return (
        <Grid2 container>
            <Grid2 size={4}>
                <UserSideMenu />
            </Grid2>
            <Grid2 size={8} className="p-4">
                <div className="mb-4">
                    <Link to="/user/discounts" className="text-blue-500 hover:underline">
                        ← Back to Discounts
                    </Link>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{discountDetail.discountCode}</h1>
                    <p className="text-gray-700 mb-3">
                        <strong>Type:</strong> {discountDetail.discountType.discountTypeName}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong>Value:</strong> {discountDetail.discountType.discountTypeName === "PERCENTAGE" ? `${discountDetail.discountValue}%` : formatPrice(discountDetail.discountValue)}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong>Status:</strong> {discountDetail.discountStatus.discountStatusName}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong>Usage Limit:</strong> {discountDetail.usageLimit}
                    </p>
                    {discountDetail.maximumDiscountValue > 0 ? 
                    <p className="text-gray-700 mb-3">
                    <strong>Maximum Discount Value:</strong> {formatPrice(discountDetail.maximumDiscountValue)}
                    </p> : ''}
                    {discountDetail.minimumOrderValue > 0 ? 
                    <p className="text-gray-700 mb-3">
                    <strong>Minimum Order Value:</strong> {formatPrice(discountDetail.minimumOrderValue)}
                    </p> : ''}
                    <p className="text-gray-700 mb-3">
                        <strong>Start Date:</strong> {new Date(discountDetail.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 mb-3">
                        <strong>End Date:</strong> {new Date(discountDetail.endDate).toLocaleDateString()}
                    </p>
                    {discountDetail.discountDescription && (
                        <div className="mt-4">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Description:</h3>
                            <p className="text-gray-700">{discountDetail.discountDescription}</p>
                        </div>
                    )}
                    {/* Thêm các thông tin discount khác bạn muốn hiển thị ở đây */}
                </div>
            </Grid2>
        </Grid2>

    );
};

export default DiscountDetailPage;