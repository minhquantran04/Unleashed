import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api'
import {
	TextField,
	Button,
	MenuItem,
	Select,
	InputLabel,
	FormControl,
	Skeleton,
} from '@mui/material'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { toast, Zoom } from 'react-toastify'

const DashboardEditProduct = () => {
	const { productId } = useParams()
	const navigate = useNavigate()
	const varToken = useAuthHeader()

	// State cho thông tin sản phẩm
	const [productName, setProductName] = useState('')
	const [productDescription, setProductDescription] = useState('')
	const [categoryId, setCategoryId] = useState([]) // Lưu danh sách ID danh mục
	const [brandId, setBrandId] = useState('')
	// Lưu trạng thái dưới dạng object { id, label }
	const [status, setStatus] = useState({ id: 3, label: 'AVAILABLE' })

	// Danh sách categories và brands
	const [categories, setCategories] = useState([])
	const [brands, setBrands] = useState([])
	const [loading, setLoading] = useState(true)

	// Các trạng thái có sẵn
	const statusOptions = [
		{ id: 1, label: 'OUT OF STOCK' },
		{ id: 2, label: 'IMPORTING' },
		{ id: 3, label: 'AVAILABLE' },
		{ id: 4, label: 'RUNNING OUT' },
		{ id: 5, label: 'NEW' },
	]

	useEffect(() => {
		fetchProductDetails()
		fetchCategoriesAndBrands()
	}, [productId])

	const fetchProductDetails = () => {
		setLoading(true)
		apiClient
			.get(`/api/products/${productId}`, {
				headers: { Authorization: varToken },
			})
			.then((response) => {
				console.log('Product details:', response.data)
				// Lấy property status dưới dạng số (ví dụ: 4)
				const { productName, description, brand, categories, status: apiStatus } = response.data

				setProductName(productName)
				setProductDescription(description || '')
				setCategoryId(categories ? categories.map((category) => category.id) : [])
				setBrandId(brand?.id || '')
				// Dùng số apiStatus để tìm object status trong statusOptions
				const fetchedStatus = statusOptions.find((s) => s.id === apiStatus) || {
					id: 3,
					label: 'AVAILABLE',
				}
				setStatus(fetchedStatus)
				setLoading(false)
			})
			.catch((error) => {
				console.error('Error fetching product details:', error)
				setLoading(false)
			})
	}

	const fetchCategoriesAndBrands = () => {
		apiClient
			.get(`/api/categories`, {
				headers: { Authorization: varToken },
			})
			.then((response) => {
				setCategories(response.data)
			})
			.catch((error) => {
				console.error('Error fetching categories:', error)
			})

		apiClient
			.get(`/api/brands`, {
				headers: { Authorization: varToken },
			})
			.then((response) => {
				setBrands(response.data)
			})
			.catch((error) => {
				console.error('Error fetching brands:', error)
			})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const updatedProduct = {
			productName,
			productDescription,
			categoryIdList: categoryId,
			brandId,
			productStatusId: status, // Gửi object { id, label }
		}
		console.log(updatedProduct)
		apiClient
			.put(`/api/products/${productId}`, updatedProduct, {
				headers: { Authorization: varToken },
			})
			.then(() => {
				toast.success('Product updated successfully', {
					position: 'bottom-right',
					transition: Zoom,
				})
				console.log('ddax')
				navigate(`/Dashboard/Products/${productId}`)
			})
			.catch((error) => {
				console.error('Error updating product:', error)
				toast.error('Failed to update product.', {
					position: 'bottom-right',
					transition: Zoom,
				})
			})
	}

	if (loading) {
		return <Skeleton variant='rectangular' width='100%' height={400} />
	}

	return (
		<div className='p-4'>
			<h1 className='text-3xl font-bold'>Update Product</h1>
			<form className='mt-6' onSubmit={handleSubmit}>
				<TextField
					label='Product Name'
					variant='outlined'
					fullWidth
					required
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
					className='mb-4'
				/>
				<TextField
					label='Product Description'
					variant='outlined'
					required
					fullWidth
					multiline
					rows={4}
					value={productDescription}
					onChange={(e) => setProductDescription(e.target.value)}
					className='mb-4'
				/>

				{/* Select Multiple Categories */}
				<FormControl fullWidth className='mb-4'>
					<InputLabel id='category-label'>Categories</InputLabel>
					<Select
						labelId='category-label'
						multiple
						required
						value={categoryId}
						onChange={(e) => setCategoryId(e.target.value)}
						label='Categories'
						renderValue={(selected) =>
							categories
								.filter((category) => selected.includes(category.id))
								.map((category) => category.categoryName)
								.join(', ')
						}
					>
						{categories.map((category) => (
							<MenuItem key={category.id} value={category.id}>
								{category.categoryName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Select Brand */}
				<FormControl fullWidth className='mb-4'>
					<InputLabel id='brand-label'>Brand</InputLabel>
					<Select
						labelId='brand-label'
						value={brandId}
						onChange={(e) => setBrandId(e.target.value)}
						label='Brand'
					>
						{brands.map((brand) => (
							<MenuItem key={brand.brandId} value={brand.brandId}>
								{brand.brandName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Select Status */}
				<FormControl fullWidth className='mb-4'>
					<InputLabel id='status-label'>Status</InputLabel>
					<Select
						labelId='status-label'
						value={status.id}
						onChange={(e) => setStatus(statusOptions.find((s) => s.id === e.target.value))}
						label='Status'
					>
						{statusOptions.map((option) => (
							<MenuItem key={option.id} value={option.id}>
								{option.label}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Button type='submit' variant='contained' color='primary'>
					Update Product
				</Button>
			</form>
		</div>
	)
}

export default DashboardEditProduct
