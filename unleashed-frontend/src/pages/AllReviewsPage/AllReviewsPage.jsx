import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../../core/api';
import ReviewStars from '../../components/reviewStars/ReviewStars';
import { Breadcrumbs, Typography, Pagination } from '@mui/material';
import MainLayout from '../../layouts/MainLayout';
import { useProduct } from '../../components/Providers/Product';
import ReviewItem from '../../components/review/ReviewItem'; // Import ReviewItem component

const AllReviewsPage = () => {
    const { productId } = useParams();
    const [allProductReviews, setAllProductReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null); // State để lưu trữ thông tin SẢN PHẨM (không chỉ tên)
    const { products } = useProduct();

    useEffect(() => {
        if (products && products.length > 0) {
            const currentProduct = products.find(prod => prod.productId === productId);
            if (currentProduct) {
                setProduct(currentProduct); // Gán TRỰC TIẾP sản phẩm tìm được vào state product
            } else {
                console.error(`Product with id ${productId} not found in products list.`);
                setProduct(null); // Set product state về null nếu không tìm thấy
            }
        }
    }, [productId, products]);

    useEffect(() => {
        const fetchAllProductReviews = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(`/api/reviews/product/${productId}`);
                setAllProductReviews(response.data);
            } catch (error) {
                console.error("Lỗi fetch all reviews:", error);
                setError(error);
                setAllProductReviews([]);
            } finally {
                setLoading(false);
            }
        };


        fetchAllProductReviews();
    }, [productId]);


    if (loading) {
        return <MainLayout><div>Loading all reviews...</div></MainLayout>;
    }

    if (error) {
        return <MainLayout><div>Error loading all reviews: {error.message}</div></MainLayout>;
    }
    
    return (
        <MainLayout>
            <div className="AllReviewsPage font-montserrat pt-20 pb-10" style={{
                marginTop: 20
            }}>
                <div className='headerBreadcums flex items-center h-32 bg-beluBlue'>
                    <div className='pl-16'>
                        <Breadcrumbs
                            sx={{
                                fontFamily: 'Poppins',
                            }}
                        >
                            <Link to={'/'}>Home</Link>
                            <Link to={'/shop'}>Shop</Link>
                            <Link to={`/shop/product/${productId}`}>{product?.productName}</Link> {/* Sử dụng product?.productName */}
                            <Typography color="textPrimary" className="font-poppins">All Reviews</Typography>
                        </Breadcrumbs>
                    </div>
                </div>
                <h1 className="text-3xl font-bold pt-10 mb-6 text-center">All Reviews for "{product?.productName}"</h1> {/* Sử dụng product?.productName */}

                <div className='content px-6 border-2 border-gray-300 rounded-lg p-6' style={{
                    margin:40
                }}>
                    {allProductReviews && allProductReviews.length > 0 ? (
                        allProductReviews.map((review, index) => (
                            <ReviewItem key={index} review={review} /> // Sử dụng ReviewItem component để hiển thị review
                        ))
                    ) : (
                        <div className="text-center">
                            <h1 className="text-xl font-semibold">No reviews available for this product.</h1>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default AllReviewsPage;
