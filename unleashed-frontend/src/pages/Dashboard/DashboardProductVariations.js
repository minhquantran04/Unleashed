import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiClient } from '../../core/api'
import { Skeleton, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import { toast, Zoom } from 'react-toastify'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { formatPrice } from '../../components/format/formats'

const DashboardProductVariations = () => {
	const { productId } = useParams()
	const [product, setProduct] = useState(null)
	const [loading, setLoading] = useState(true)
	const [openModal, setOpenModal] = useState(false)
	const [variationToDelete, setVariationToDelete] = useState(null)
	const role = useAuthUser()?.role
	const varToken = useAuthHeader()

	useEffect(() => {
		fetchProductDetails()
	}, [productId])

	const fetchProductDetails = async () => {
		try {
			setLoading(true)
			const response = await apiClient.get(`/api/products/${productId}/detail`, {
				headers: { Authorization: varToken },
			})
			console.log('Product Data:', response.data)
			setProduct(response.data || { productVariations: [] })
		} catch (error) {
			console.error('Error fetching product details:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteVariation = (variationId, size, color) => {
		setVariationToDelete({ variationId, size, color })
		setOpenModal(true)
	}

	const confirmDeleteVariation = async () => {
		if (!variationToDelete) return
		const { variationId } = variationToDelete

		try {
			await apiClient.delete(`/api/product-variations/${variationId}`, {
				headers: { Authorization: varToken },
			})
			toast.success('Deleted successfully!', { position: 'bottom-right', transition: Zoom })

			setProduct((prevProduct) => ({
				...prevProduct,
				productVariations: prevProduct.productVariations.filter(
					(variation) => variation.id !== variationId
				),
			}))
		} catch (error) {
			console.error('Error deleting product variation:', error)
		} finally {
			setOpenModal(false)
		}
	}

	if (loading) {
		return <Skeleton variant='rectangular' width='100%' height={400} />
	}

	return (
		<div className='p-4'>
			<div>
				<h1 className='text-3xl font-bold'>{product?.productName || 'N/A'}</h1>
				<p className='mt-2 text-gray-600'>
					{product?.productDescription || 'No description available'}
				</p>

				<div className='mt-4'>
					<p className='text-gray-600'>
						Category:{' '}
						{product?.categories && product.categories.length > 0
							? product.categories.map((category) => category.categoryName).join(', ')
							: 'N/A'}
					</p>
					<p className='text-gray-600'>Brand: {product?.brand?.brandName || 'N/A'}</p>
					<p className='text-gray-600'>
						Created At:{' '}
						{new Date(product?.productCreatedAt).toLocaleDateString() +
							' ' +
							new Date(product?.productCreatedAt).toLocaleTimeString()}
					</p>
					<p className='text-gray-600'>
						Updated At:{' '}
						{new Date(product?.productUpdatedAt).toLocaleDateString() +
							' ' +
							new Date(product?.productUpdatedAt).toLocaleTimeString()}
					</p>
				</div>

				<div className='mt-4 flex justify-end space-x-4'>
					{role !== 'STAFF' && (
						<Link
							to={`/Dashboard/Products/Edit/${product.productId}`}
							className='text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center'
						>
							<FaEdit className='mr-2' /> Edit Product
						</Link>
					)}

					<Link
						to={`/Dashboard/Products/${product.productId}/Add`}
						className='text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center'
					>
						<FaPlus className='mr-2' /> Add New Variation
					</Link>
				</div>
			</div>

			<div className='mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
				{product?.productVariations?.length > 0 ? (
					product.productVariations.map((variation) => (
						<div
							key={variation.id}
							className='border rounded-lg p-4 flex flex-col items-center shadow-md relative transition-transform duration-300 transform hover:scale-105'
						>
							<button
								onClick={() =>
									handleDeleteVariation(
										variation.id,
										variation.size.sizeName,
										variation.color.colorName
									)
								}
								className='absolute top-2 right-2 text-red-500 hover:text-red-700 p-2 bg-white'
							>
								<FaTrash size={18} />
							</button>
							<Link
								to={`/Dashboard/Products/${productId}/Edit/${variation.id}`}
								className='absolute top-2 right-10 text-blue-500 hover:text-blue-700 p-2 bg-white'
							>
								<FaEdit size={18} />
							</Link>
							<img
								src={variation.variationImage || '/images/placeholder.png'}
								alt={`${product.productName} - ${variation.color.colorName}`}
								className='w-full h-64 object-cover mb-4 rounded-md'
							/>
							<h2 className='font-semibold text-lg'>Size: {variation.size.sizeName}</h2>
							<p className='text-gray-500'>Color: {variation.color.colorName}</p>
							<p className='font-bold mt-2 text-xl'>
								Price: {formatPrice(variation.variationPrice)}
							</p>
						</div>
					))
				) : (
					<p className='text-gray-500'>No product variations available.</p>
				)}
			</div>

			<Dialog open={openModal} onClose={() => setOpenModal(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					{variationToDelete && (
						<p>
							Are you sure you want to delete the variation? <br />
							<strong>{`Size: ${variationToDelete.size}, Color: ${variationToDelete.color}`}</strong>
						</p>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenModal(false)} color='primary'>
						Cancel
					</Button>
					<Button onClick={confirmDeleteVariation} color='secondary'>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default DashboardProductVariations
