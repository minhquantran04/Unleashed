import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { apiClient } from '../../core/api';
import ProductCard from '../../components/Search/ProductCard';

const SearchResultsPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const [allSearchResults, setAllSearchResults] = useState([]); // State để lưu TOÀN BỘ kết quả tìm kiếm
    const [searchResults, setSearchResults] = useState([]); // State để lưu kết quả hiển thị TRÊN TRANG HIỆN TẠI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 20;

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) {
                setAllSearchResults([]); // Clear ALL results
                setSearchResults([]); // Clear page results
                setLoading(false);
                setTotalPages(0);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // Lấy TOÀN BỘ kết quả tìm kiếm mà không phân trang ban đầu
                const response = await apiClient.get(
                    `/api/products/search?query=${query}` // Loại bỏ page và size parameters
                );
                let results = response.data.content;

                // Sắp xếp kết quả TẤT CẢ kết quả tìm kiếm - ĐÃ CHỈNH SỬA LOGIC SẮP XẾP
                if (results && results.length > 0) {
                    results.sort((a, b) => {
                        const queryLower = query.toLowerCase();
                        const nameA = a.productName.toLowerCase();
                        const descA = a.productDescription ? a.productDescription.toLowerCase() : '';
                        const codeA = a.productCode ? a.productCode.toLowerCase() : '';
                        const nameB = b.productName.toLowerCase();
                        const descB = b.productDescription ? b.productDescription.toLowerCase() : '';
                        const codeB = b.productCode ? b.productCode.toLowerCase() : '';

                        const nameStartsWithA = nameA.startsWith(queryLower);
                        const nameStartsWithB = nameB.startsWith(queryLower);
                        const nameIndexA = nameA.indexOf(queryLower);
                        const nameIndexB = nameB.indexOf(queryLower);
                        const descMatchA = descA.includes(queryLower);
                        const descMatchB = descB.includes(queryLower);
                        const codeMatchA = codeA.includes(queryLower);
                        const codeMatchB = codeB.includes(queryLower);

                        if (nameStartsWithA && !nameStartsWithB) return -1;
                        if (!nameStartsWithA && nameStartsWithB) return 1;
                        if (nameStartsWithA && nameStartsWithB) return 0;

                        if (nameIndexA !== -1 && nameIndexB !== -1) {
                            return nameIndexA - nameIndexB;
                        }
                        if (nameIndexA !== -1 && nameIndexB === -1) return -1;
                        if (nameIndexA === -1 && nameIndexB !== -1) return 1;


                        if (descMatchA && !descMatchB) return -1;
                        if (!descMatchA && descMatchB) return 1;
                        if (descMatchA && descMatchB) return 0;

                        if (codeMatchA && !codeMatchB) return -1;
                        if (!codeMatchA && codeMatchB) return 1;
                        return 0;
                    });
                }

                setAllSearchResults(results); // Lưu TOÀN BỘ kết quả đã sắp xếp vào state allSearchResults

            } catch (error) {
                console.error("Lỗi fetch search results page:", error);
                setError(error);
                setAllSearchResults([]); // Clear ALL results on error
                setSearchResults([]); // Clear page results on error
                setTotalPages(0);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]); // Dependency array chỉ còn query, vì fetch toàn bộ kết quả chỉ cần query

    // Use useMemo to paginate searchResults based on currentPage and pageSize
    const paginatedResults = useMemo(() => {
        const startIndex = currentPage * pageSize;
        const endIndex = startIndex + pageSize;
        return allSearchResults.slice(startIndex, endIndex); // Cắt mảng để phân trang
    }, [allSearchResults, currentPage, pageSize]);

    useEffect(() => {
        setSearchResults(paginatedResults); // Cập nhật searchResults với kết quả phân trang
        setTotalPages(Math.ceil(allSearchResults.length / pageSize)); // Tính lại totalPages dựa trên tổng số kết quả
        window.scrollTo(0, 0);
    }, [paginatedResults, allSearchResults.length, pageSize]); // useEffect này chạy khi paginatedResults hoặc pageSize thay đổi


    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) { // Conditional rendering for loading state
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-75 z-50"> {/* Overlay */}
                <div className="text-2xl font-semibold">Loading search results...</div> {/* Loading text */}
            </div>
        );
    }

    if (error) {
        return <div>Error loading search results: {error.message}</div>;
    }

    return (
        <div className="px-4 md:px-8 lg:px-16 xl:px-10">

            {searchResults.length > 0 ? (

                <div>
                    <h2
                        className="mt-20"
                        style={{
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: 'black',
                        }}
                    >Search results for: "{query}"</h2>
                    {/* Pagination Controls - ĐÃ THÊM LÊN PHÍA TRÊN, ĐÃ SỬA mt-8 */}
                    <div className="flex justify-center mt-2 mb-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="flex mt-2">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
                        {searchResults.map(product => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>

                    {/* Pagination Controls - VẪN GIỮ Ở PHÍA DƯỚI */}
                    <div className="flex justify-center mt-10">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="flex mt-2">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className="px-4 py-2 mx-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="mt-40"
                    style={{
                        fontSize: '1.5rem',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: 'black',
                    }}
                >
                    No products found for "{query}".
                </div>
            )}
        </div>
    );
};

export default SearchResultsPage;