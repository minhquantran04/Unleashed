import React from "react";
import { formatPrice } from "../../components/format/formats";
import { Link } from 'react-router-dom'; // Đã import Link
import { IoCopyOutline } from "react-icons/io5"; // Đã import IoCopyOutline
import { toast, Zoom } from "react-toastify"; // Đã import toast

const DiscountCard = ({ discount, discountCode, timesUsed, expiry, discountType, discountId }) => { // Đảm bảo nhận prop brand

    const handleCopyCode = () => {
        navigator.clipboard.writeText(discountCode); // Sử dụng brand để copy discountCode
        toast.success("Discount code copied!", {
            position: "bottom-center",
            transition: Zoom
        })
    };

    return (
        <Link to={`/user/discounts/${discountId}`} className="block no-underline"> {/* Link điều hướng */}
            <div className="relative bg-belugradient text-white rounded-lg p-4 shadow-lg w-full sm:w-52 h-40 hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-between items-center">
                    <span className="bg-red-500 text-xs font-semibold px-2 py-1 rounded-md font-montserrat">
                        {timesUsed} TIME USED
                    </span>
                    {/* Copy Icon - Vẫn giữ nguyên */}
                    <IoCopyOutline
                        className="text-white text-lg cursor-pointer hover:text-gray-300"
                        onClick={handleCopyCode} // Vẫn giữ onClick handler
                        title="Copy Discount Code"
                    />
                </div>
                <div className="flex flex-col items-center mt-4 mb-2 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold font-montserrat">
                        {discountType.discountTypeName === "PERCENTAGE" ? `${discount}%` : formatPrice(discount)}
                    </h1>
                    {/* Hiển thị discountCode (brand) - Vẫn giữ nguyên */}
                    <p className="text-lg font-semibold mt-1 font-montserrat">{discountCode}</p>
                </div>
                <div className="absolute bottom-2 right-2 text-xs font-montserrat">
                    Exp: {expiry}
                </div>
            </div>
        </Link>
    );
};

export default DiscountCard;