import React, {useEffect, useState} from "react";
import {apiClient} from "../../core/api";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {formatPrice} from "../../components/format/formats";

const DashboardStockTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const varToken = useAuthHeader();

    useEffect(() => {
        apiClient
            .get("/api/stock-transactions", {
                headers: {
                    Authorization: varToken,
                },
            })
            .then((response) => {
                const transactionsData = response.data;
                setTransactions(transactionsData);
            })
            .catch((error) => {
                console.error("Error fetching stock transactions:", error);
            });
    }, [varToken]);

    const displayValue = (value) =>
        value !== null && value !== undefined ? value : "null";

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6">Stock Transactions</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <img
                                    src={displayValue(transaction.variationImage)}
                                    alt="Product Variation"
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <h2 className="font-semibold">
                                        {displayValue(transaction.productName)}
                                    </h2>
                                    <p className="text-sm font-bold text-gray-600">
                                        {displayValue(transaction.stockName)} |{" "}
                                        <span
                                            className={`${
                                                transaction.transactionTypeName === "IN"
                                                    ? "text-blue-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                      {displayValue(transaction.transactionTypeName)}
                    </span>
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p>
                                    <strong>Category:</strong> {displayValue(transaction.categoryName)}
                                </p>
                                <p>
                                    <strong>Brand:</strong> {displayValue(transaction.brandName)}
                                </p>
                                <p>
                                    <strong>Size:</strong> {displayValue(transaction.sizeName)}
                                </p>
                                <p className="flex items-center">
                                    <strong>Color:</strong>{" "}
                                    <span
                                        className="inline-block w-4 h-4 ml-1 mr-1 rounded-full border border-gray-200"
                                        style={{
                                            backgroundColor:
                                                transaction.colorHexCode || "transparent",
                                        }}
                                    ></span>
                                    {displayValue(transaction.colorName)}
                                </p>
                                <p>
                                    <strong>Price per unit:</strong>{" "}
                                    {formatPrice(transaction.transactionProductPrice)}
                                </p>
                                <p>
                                    <strong>Quantity:</strong> {displayValue(transaction.transactionQuantity)}
                                </p>
                                <p>
                                    <strong>Date:</strong>{" "}
                                    {displayValue(
                                        new Date(transaction.transactionDate).toLocaleDateString()
                                    )}
                                </p>
                                <p>
                                    <strong>Staff:</strong>{" "}
                                    {displayValue(transaction.inchargeEmployeeUsername)}
                                </p>
                                <p>
                                    <strong>Provider:</strong>{" "}
                                    {displayValue(transaction.providerName)}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-red-500">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardStockTransactions;