import React, { useState, useEffect, useRef, useMemo } from 'react'
import Carousel from 'react-material-ui-carousel'
import { useCart } from 'react-use-cart'
import { Navigate, NavLink, useParams, useNavigate, Link } from 'react-router-dom'
import { Tabs, Tab, Box, Rating, Skeleton, Breadcrumbs } from '@mui/material'
import { formatPrice } from '../../components/format/formats'
import { getProductItem, getProductRecommendations } from '../../service/ShopService'
import { useProduct } from '../../components/Providers/Product'
import ProductRecommend from '../../components/items/ProductRecommend'
import ReviewStars from '../../components/reviewStars/ReviewStars'
import { addToCart } from '../../service/UserService'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { jwtDecode } from 'jwt-decode'
import ReviewItem from '../../components/review/ReviewItem' // Import ReviewItem component
import axios from 'axios'
import {
	getWishlist,
	checkWishlist,
	addToWishlist,
	removeFromWishlist,
} from '../../service/WishlistService'

const ProductDetailPage = () => {
	const { items, addItem, getItem } = useCart()
	const productById = useParams()
	const navigate = useNavigate()
	const authHeader = useAuthHeader()

	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [selectedColor, setSelectedColor] = useState(null)
	const [selectedSize, setSelectedSize] = useState(null)
	const [quantity, setQuantity] = useState(1)
	const [carouselIndex, setCarouselIndex] = useState(0)
	const [activeTab, setActiveTab] = useState(0)
	const [intervalId, setIntervalId] = useState(null)
	const [cartCheck, setCartCheck] = useState(true)
	const { products } = useProduct() //This might be unused. Double check this!
	const prevColorRef = useRef(selectedColor)
	const [username, setUsername] = useState(null)
	const [userId, setUserId] = useState(null)
	const [recommendedProducts, setRecommendedProducts] = useState([]) // Store recommended products
	const [loadingRecommendations, setLoadingRecommendations] = useState(false)
	const [isInWishlist, setIsInWishlist] = useState(false)
	const [showAllReviews, setShowAllReviews] = useState(false)

	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true)
			try {
				const data = await getProductItem(productById)
				setProduct(data)
				console.log(data)
				if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].colorName)
				if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0].sizeName)
			} catch (error) {
				console.error('Failed to fetch product data:', error)
				// Sử dụng navigate để chuyển hướng khi có lỗi
				navigate('/')
			} finally {
				setLoading(false)
			}
		}

		fetchProduct()
	}, [productById, navigate])

	console.log('authHeader: ', authHeader)

	useEffect(() => {
		if (authHeader) {
			const token = authHeader.split(' ')[1] // No parentheses after authHeader
			try {
				const decodedToken = jwtDecode(token)
				setUsername(decodedToken.sub) //  Get the username.
			} catch (error) {
				console.error('Error decoding token:', error)
				//   Handle token decoding errors (e.g., invalid token)
			}
		} else {
			setUsername(null)
		}
	}, [authHeader])

	// Fetch recommendations when product and username are available
	useEffect(() => {
		const fetchRecommendations = async () => {
			if (product?.productId && username) {
				setLoadingRecommendations(true)
				try {
					const recommendations = await getProductRecommendations(product.productId, username)
					setRecommendedProducts(recommendations)
				} catch (error) {
					console.error('Error fetching recommendations:', error)
				} finally {
					setLoadingRecommendations(false)
				}
			} else if (product?.productId) {
				setLoadingRecommendations(true)
				try {
					const recommendations = await getProductRecommendations(product.productId, '')
					setRecommendedProducts(recommendations)
				} catch (error) {
					console.error('Error fetching recommendations:', error)
				} finally {
					setLoadingRecommendations(false)
				}
			}
		}

		fetchRecommendations()
	}, [product?.productId, username]) // Depend on productId and username

	const { allImages, imageStartIndex } = useMemo(() => {
		if (!product) return { allImages: [], imageStartIndex: {} }

		const images = []
		const startIndex = {}
		let imageCounter = 0

		// Function to get the last part of the URL (filename)
		const getImagePath = (url) => {
			try {
				const urlObj = new URL(url, window.location.origin)
				return urlObj.pathname.split('/').pop()
			} catch (error) {
				console.warn('Invalid URL:', url, 'Error:', error)
				return url.split('/').pop()
			}
		}

		;(product.colors || []).forEach((color) => {
			const colorName = color?.colorName
			const variations = product.variations?.[colorName] || {}

			if (colorName && variations) {
				Object.keys(variations).forEach((size) => {
					const image = variations[size]?.images

					// Ensure images for each color are unique by checking the filename
					if (
						image &&
						!images.some(
							(img) =>
								getImagePath(img.image) === getImagePath(image) && img.colorName === colorName
						)
					) {
						images.push({ colorName, image })
						imageCounter++
					}
				})
			}

			// Track the start index of images for each color
			startIndex[colorName] = imageCounter
		})

		return { allImages: images, imageStartIndex: startIndex }
	}, [product])

	useEffect(() => {
		// When changing color, ensure the new color has available sizes
		if (product && selectedColor) {
			const availableSizeForNewColor =
				product.variations[selectedColor] &&
				Object.keys(product.variations[selectedColor]).length > 0

			if (!availableSizeForNewColor) {
				// If no available sizes for the selected color, fall back to the first available color with sizes
				const newColor = Object.keys(product.colors).find((colorName) => {
					return Object.keys(product.variations[colorName] || {}).length > 0
				})

				if (newColor) {
					setSelectedColor(newColor)
					setSelectedSize(Object.keys(product.variations[newColor])[0])
				}
			} else {
				// If the new color has available sizes, adjust the quantity
				const newMaxQuantity = product.variations[selectedColor][selectedSize]?.quantity || 1
				if (newMaxQuantity < quantity) {
					setQuantity(newMaxQuantity)
				} else {
					setQuantity(Math.min(newMaxQuantity, quantity))
				}
			}
		}
	}, [selectedColor, selectedSize, product, quantity])

	const startDecrement = () => {
		setQuantity((prev) => Math.max(1, prev - 1))
		const id = setInterval(() => {
			setQuantity((prev) => Math.max(1, prev - 1))
		}, 100)
		setIntervalId(id)
	}

	const startIncrement = () => {
		setQuantity((prev) =>
			Math.min(maxQuantity - (getItem(selectedVariation.id)?.quantity || 0), prev + 1)
		)
		const id = setInterval(() => {
			setQuantity((prev) =>
				Math.min(maxQuantity - (getItem(selectedVariation.id)?.quantity || 0), prev + 1)
			)
		}, 100)
		setIntervalId(id)
	}

	const stopInterval = () => {
		clearInterval(intervalId)
		setIntervalId(null)
	}

	const selectedVariation = product?.variations?.[selectedColor]?.[selectedSize] || null
	const maxQuantity = selectedVariation?.quantity || 1

	const CalculateFinalPrice = () => {
		if (!product || !selectedVariation) return 0

		if (
			!product?.saleType?.saleTypeName ||
			product.saleValue === null ||
			product.saleValue === undefined
		) {
			return selectedVariation.price
		}

		if (product?.saleType?.saleTypeName === 'PERCENTAGE') {
			return selectedVariation.price - (selectedVariation.price * product.saleValue) / 100
		}

		if (product?.saleType?.saleTypeName === 'FIXED AMOUNT') {
			return selectedVariation.price - product.saleValue
		}

		return selectedVariation.price
	}

	useEffect(() => {
		if (!product || !selectedVariation) return

		// Check if product is available and if variation is selected
		const existingItem = items.find(
			(item) => item.id === `${product?.productId}@${selectedVariation?.id}`
		)

		if (existingItem) {
			const newQuantity = existingItem.quantity + quantity
			if (newQuantity > selectedVariation?.quantity) {
				setCartCheck(false)
			} else {
				setCartCheck(true)
			}
		} else {
			setCartCheck(true)
		}
	}, [quantity, selectedVariation, items, product?.productId])

	const finalPrice = CalculateFinalPrice()

	const handleAddToCart = () => {
		if (authHeader === null) {
			navigate('/register')
			return
		}
		if (!cartCheck) return
		const cartItem = {
			id: selectedVariation.id,
			name: product.productName,
			color: selectedColor,
			size: selectedSize,
			image: selectedVariation.images,
			price: selectedVariation.price,
			saledPrice: finalPrice,
			maxQuantity: selectedVariation.quantity,
		}
		addToCart(authHeader, selectedVariation.id, quantity)
		addItem(cartItem, quantity)
	}

	useEffect(() => {
		// Update the carousel index whenever the selected color changes
		if (product && selectedColor) {
			setCarouselIndex(imageStartIndex[selectedColor] - 1 || 0)
		}
	}, [selectedColor, imageStartIndex, product])

	useEffect(() => {
		if (prevColorRef.current !== selectedColor) {
			prevColorRef.current = selectedColor
		}
	}, [selectedColor])

	useEffect(() => {
		const checkProductInWishlist = async () => {
			if (username && product?.productId) {
				const response = await checkWishlist(username, product.productId)
				setIsInWishlist(response || false) // Nếu lỗi, set false mặc định
			} else {
				setIsInWishlist(false)
			}
		}

		checkProductInWishlist()
	}, [username, product?.productId])

	const handleAddToWishlist = async () => {
		if (!authHeader) {
			navigate('/register')
			return
		}

		const success = await addToWishlist(username, product.productId)
		if (success) setIsInWishlist(true)
	}

	const handleRemoveFromWishlist = async () => {
		if (!authHeader) {
			navigate('/register')
			return
		}

		const success = await removeFromWishlist(username, product.productId)
		if (success) setIsInWishlist(false)
	}

	if (loading) {
		return (
			<div className='ProductDetail'>
				<div className='headerBreadcums h-32 bg-blueOcean'></div>
				<div className='grid grid-cols-5 gap-6 px-20 py-10'>
					<div className='col-span-3 place-items-center'>
						<Skeleton variant='rectangular' width={600} height={400} />
					</div>
					<div className='properties pl-10 col-span-2'>
						<Skeleton variant='text' width='80%' height={80} />
						<Skeleton variant='text' width='40%' height={40} />
						<Skeleton variant='text' width='30%' height={30} />
						<Skeleton variant='rectangular' width='100%' height={50} />
					</div>
				</div>
			</div>
		)
	}
	if (loadingRecommendations) {
		return (
			<div className='ProductDetail'>
				{/* ... (rest of your product detail JSX) ... */}
				<div className='recommended-products mt-10'>
					<h2 className='text-3xl font-semibold mb-4'>Recommended Products</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 py-5'>
						{/* Display skeletons for loading recommendations */}
						{[...Array(5)].map((_, index) => (
							<Skeleton key={index} variant='rectangular' width={250} height={300} />
						))}
					</div>
				</div>
			</div>
		)
	}
	return (
		<div className='ProductDetail font-montserrat'>
			<div className='headerBreadcums flex items-center h-32 bg-beluBlue'>
				<div className='pl-16'>
					<Breadcrumbs
						sx={{
							fontFamily: 'Poppins',
						}}
					>
						<NavLink to={'/'}>Home</NavLink>
						<NavLink to={'/Shop'}>Shop</NavLink>
						<p>{product.productName}</p>
					</Breadcrumbs>
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 px-4 sm:px-10 lg:px-20 py-10'>
				<div className='col-span-1 lg:col-span-3 place-items-center'>
					{selectedVariation?.images ? (
						<Carousel
							autoPlay={selectedColor !== null && prevColorRef.current === selectedColor}
							index={carouselIndex}
							sx={{
								width: '100%',
								maxWidth: '800px',
							}}
						>
							{allImages.map((item, index) => (
								<div
									key={index}
									style={{
										width: '100%',
										height: '30rem',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										backgroundColor: '#f0f0f0',
									}}
								>
									<img
										src={item.image}
										alt={`Product in ${item.colorName}`}
										style={{
											maxWidth: '100%',
											maxHeight: '100%',
											objectFit: 'contain',
										}}
										onError={(e) => {
											e.target.src = 'https://placehold.co/600x400'
										}}
									/>
								</div>
							))}
						</Carousel>
					) : (
						<div className='text-center'>
							<p>No images available for the selected color and size.</p>
						</div>
					)}
				</div>

				<div className='properties col-span-1 lg:col-span-2 pl-4 lg:pl-10'>
					<h1 className='mb-4 font-bold text-2xl sm:text-3xl lg:text-5xl'>{product.productName}</h1>
					<p className='mb-4 text-lg sm:text-xl font-semibold text-blue-700'>
						{formatPrice(finalPrice)}
					</p>
					{product.saleValue > 0 && (
						<p className='mb-2 text-gray-500 line-through'>
							{formatPrice(selectedVariation.price)}
						</p>
					)}
					<div className='rating mb-4 flex items-center text-gray-500'>
						<Rating name='half-rating-read' precision={0.5} readOnly value={product.avgRating} />
						<div className='px-4'>|</div>
						<div className='customerReview text-lg sm:text-xl'>
							{product.totalRating} Customer Reviews
						</div>
					</div>
					{/* Color Selector */}
					{/* Color Selector */}
					<div className='colors flex items-center mb-4'>
						<div className='font-semibold text-gray-600'>Color:</div>
						<div className='px-4 flex gap-2'>
							{product?.colors?.map((color) => {
								const hasAvailableSizes =
									product?.variations?.[color.colorName] &&
									Object.values(product.variations[color.colorName]).some(
										(variationBySize) => variationBySize?.quantity > 0
									)
								return (
									hasAvailableSizes && (
										<div
											key={color.colorId}
											className={`cursor-pointer w-8 h-8 border border-gray-300 rounded-full ${
												selectedColor === color.colorName ? 'ring-2 ring-blue-500' : ''
											}`}
											style={{
												backgroundColor: color.colorHexCode,
												opacity: hasAvailableSizes ? 1 : 0.5,
											}}
											onClick={() => {
												if (hasAvailableSizes) {
													setSelectedColor(color.colorName)
													// Find the first available size for the newly selected color
													const firstAvailableSize = Object.keys(
														product.variations[color.colorName] || {}
													).find(
														(sizeName) =>
															product.variations[color.colorName][sizeName]?.quantity > 0
													)
													if (firstAvailableSize) {
														setSelectedSize(firstAvailableSize)
													} else {
														setSelectedSize(null) // No available size for this color
													}
												}
											}}
										/>
									)
								)
							})}
						</div>
					</div>
					{/* Size Selector */}
					<div className='sizes flex items-center mb-4'>
						<div className='font-semibold text-gray-600'>Size:</div>
						<div className='flex gap-2 flex-row px-5'>
							{product?.sizes?.map((size) => {
								const isSizeAvailable = product?.variations?.[selectedColor]?.[size.sizeName]
								const quantityAvailable = isSizeAvailable
									? product.variations[selectedColor][size.sizeName]?.quantity
									: 0
								return (
									quantityAvailable > 0 && (
										<div
											key={size.sizeId}
											className={`cursor-pointer px-4 py-2 border border-gray-300 rounded-lg ${
												selectedSize === size.sizeName ? 'bg-blue-500 text-white' : ''
											}`}
											onClick={() => isSizeAvailable && setSelectedSize(size.sizeName)}
											style={{ opacity: isSizeAvailable ? 1 : 0.5 }}
										>
											{size.sizeName}
										</div>
									)
								)
							})}
						</div>
					</div>
					<div className='quantity mb-6'>
						<div className='font-semibold text-gray-700 mb-2'>Quantity:</div>
						<div className='flex items-center'>
							<button
								className='px-4 py-2 bg-gray-200 text-gray-700 rounded-l-lg hover:bg-gray-300 transition-colors focus:outline-none shadow-sm'
								onMouseDown={startDecrement}
								onMouseUp={stopInterval}
								onMouseLeave={stopInterval}
							>
								-
							</button>
							<input
								type='number'
								min={1}
								max={maxQuantity}
								value={quantity}
								onChange={(e) => {
									let newValue = parseInt(e.target.value, 10)
									if (isNaN(newValue)) return
									if (newValue >= 1 && newValue <= maxQuantity) {
										setQuantity(newValue)
									}
								}}
								className='w-24 px-4 py-2 text-center border border-gray-300 outline-none focus:border-indigo-400 transition-colors shadow-inner rounded-none'
							/>
							<button
								className='px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 transition-colors focus:outline-none shadow-sm'
								onMouseDown={startIncrement}
								onMouseUp={stopInterval}
								onMouseLeave={stopInterval}
								disabled={quantity + (getItem(selectedVariation.id)?.quantity || 0) >= maxQuantity}
							>
								+
							</button>
							<p className='ml-4 text-sm text-gray-500'>
								{selectedVariation?.quantity || 0} pieces available
							</p>
						</div>
					</div>

					<button
						className={`${
							cartCheck &&
							quantity + (getItem(selectedVariation.id)?.quantity || 0) <=
								selectedVariation?.quantity
								? 'bg-blue-500 hover:bg-blue-600 active:scale-105'
								: 'bg-gray-300'
						} text-white px-4 py-2 rounded-lg w-full mt-4 transition-colors duration-150`}
						onClick={handleAddToCart}
						disabled={
							!cartCheck ||
							quantity + (getItem(selectedVariation.id)?.quantity || 0) >
								selectedVariation?.quantity
						}
					>
						Add to Cart
					</button>
					<button
						className={`${
							isInWishlist
								? 'bg-red-500 hover:bg-red-600 active:scale-105'
								: 'bg-yellow-500 hover:bg-yellow-600 active:scale-105'
						} text-white px-4 py-2 rounded-lg w-full mt-2 transition-colors duration-150`}
						onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist} // Gọi hàm tương ứng dựa trên isInWishlist
					>
						{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}{' '}
						{/* Thay đổi text nút dựa trên isInWishlist */}
					</button>
				</div>
			</div>

			{/* Description and Reviews */}
			<div className='desAndRe px-4 sm:px-10'>
				{/* Description Section */}
				<div className='description-section mb-8'>
					<h2 className='text-2xl font-bold mb-4'>Description</h2>
					<div className='content'>{product.description}</div>
				</div>

				{/* Reviews Section */}
				<div className='reviews-section mb-8'>
					<h2 className='text-2xl font-bold mb-4'>Reviews</h2>
					<div className='content px-6 border-2 border-gray-300 rounded-lg p-6'>
						{/* Hiển thị reviews (ProductReviewDTO) */}
						{product.reviews && product.reviews.length > 0 ? (
							<>
								{showAllReviews ? ( // Trường hợp đã "Read all"
									<>
										{product.reviews.map((review, index) => (
											<ReviewItem key={index} review={review} product={product.productId} />
										))}
										{product.reviews.length > 5 && (
											<button
												onClick={() => setShowAllReviews(false)}
												className='border border-gray-300 text-black-500 font-semibold px-3 hover:scale-105 transition-transform text-base focus:outline-none mt-4 block mx-auto'
											>
												Show less reviews
											</button>
										)}
									</>
								) : (
									// Trường hợp ban đầu hoặc chưa "Read all"
									<>
										{product.reviews.slice(0, 5).map((review, index) => (
											<ReviewItem key={index} review={review} product={product.productId} />
										))}
										{product.reviews.length > 5 && (
											<button
												onClick={() => setShowAllReviews(true)}
												className='border border-gray-300 text-black-500 font-semibold px-3 hover:scale-105 transition-transform text-base focus:outline-none mt-4 block mx-auto'
											>
												Read all reviews ({product.reviews.length - 5}+)
											</button>
										)}
									</>
								)}
							</>
						) : (
							<h1>No reviews available!</h1>
						)}
					</div>
				</div>
				{/* Recommended Products */}
				<div className='recommended-products mt-10'>
					<h2 className='text-3xl font-semibold mb-4'>Recommended Products</h2>
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1 py-5'>
						{recommendedProducts.map((item) => (
							<ProductRecommend key={item.productId} product={item} username={username} />
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProductDetailPage
