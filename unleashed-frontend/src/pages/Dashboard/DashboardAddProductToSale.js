import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api' // API client
import { toast, Zoom } from 'react-toastify'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { formatPrice } from '../../components/format/formats'
import {
	TextField,
	Grid,
	Card,
	CardContent,
	Checkbox,
	FormControlLabel,
	Button,
	Typography,
} from '@mui/material'

const DashboardAddProductToSale = () => {
	const { saleId } = useParams()
	const [products, setProducts] = useState([])
	const [selectedProductIds, setSelectedProductIds] = useState([])
	const [filteredProducts, setFilteredProducts] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const navigate = useNavigate()
	const varToken = useAuthHeader()

	useEffect(() => {
		// Fetch available products
		apiClient
			.get('/api/products/in-stock', {
				headers: {
					Authorization: varToken,
				},
			})
			.then((response) => {
				setProducts(response.data)
			})
			.catch((error) => {
				console.error('Error fetching products:', error)
			})

		// Fetch products already in the sale
		apiClient
			.get(`/api/sales/${saleId}/products`, {
				headers: {
					Authorization: varToken,
				},
			})
			.then((response) => {
				const existingProductIds = response.data.map((product) => product.productId)
				setProducts((prevProducts) =>
					prevProducts.filter((product) => !existingProductIds.includes(product.productId))
				)
			})
			.catch((error) => {
				console.error('Error fetching existing products in sale:', error)
			})
	}, [saleId])

	useEffect(() => {
		setFilteredProducts(
			products.filter((product) =>
				product.productName.toLowerCase().includes(searchQuery.toLowerCase())
			)
		)
	}, [products, searchQuery])

	const handleProductChange = (productId) => {
		setSelectedProductIds(
			(prev) =>
				prev.includes(productId)
					? prev.filter((id) => id !== productId) // If selected, unselect it
					: [...prev, productId] // If not selected, select it
		)
	}

	const handleAddProducts = () => {
		apiClient
			.post(
				`/api/sales/${saleId}/products`,
				{ productIds: selectedProductIds },
				{
					headers: {
						Authorization: varToken,
					},
				}
			)
			.then((response) => {
				toast.success(response.data.message, {
					position: 'bottom-right',
					transition: Zoom,
				})
				navigate(`/Dashboard/Sales/${saleId}`)
			})
			.catch((error) => {
				toast.error(error.response?.data?.message || 'Failed to add products', {
					position: 'bottom-right',
					transition: Zoom,
				})
			})
	}

	return (
		<div style={{ padding: '20px' }}>
			<Typography variant='h4' component='h1' gutterBottom>
				Add Products to Sale
			</Typography>

			<TextField
				label="Search by product's name"
				variant='outlined'
				fullWidth
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				margin='normal'
			/>

			<Grid container spacing={4} style={{ marginTop: '20px' }}>
				{filteredProducts.map((product) => (
					<Grid item xs={12} sm={6} md={3} key={product.productId}>
						{' '}
						{/* 4 sản phẩm trên một hàng */}
						<Card
							sx={{
								border: selectedProductIds.includes(product.productId)
									? '2px solid #1976d2'
									: '1px solid #ddd',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								height: '100%', // Make sure card has full height
							}}
							onClick={() => handleProductChange(product.productId)} // Khi click vào Card sẽ toggle chọn hoặc bỏ chọn
						>
							<CardContent sx={{ flexGrow: 1 }}>
								<img
									src={product.productVariations[0].variationImage}
									alt={product.productName}
									style={{
										objectFit: 'cover',
										marginBottom: '10px',
										maxWidth: '200px',
										maxHeight: '200px',
										display: 'flex',
										alignItems: 'center',
									}}
								/>
								<Typography variant='h6' component='h2' noWrap title={product.productName}>
									{product.productName}
								</Typography>
								<Typography color='textSecondary'>Brand: {product.brand.brandName}</Typography>
								<Typography color='textSecondary'>
									Category: {product.categories?.map((cat) => cat.categoryName).join(', ')}
								</Typography>
								<Typography color='textSecondary'>
									Avg. Rating: {product.averageRating} ⭐
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			<Button
				variant='contained'
				color='primary'
				onClick={handleAddProducts}
				style={{ marginTop: '20px' }}
			>
				Add Products
			</Button>
		</div>
	)
}

export default DashboardAddProductToSale
