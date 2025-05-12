import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api'
import {
	Button,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Box,
	IconButton,
	FormHelperText,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { toast, Zoom } from 'react-toastify'

const DashboardAddProductVariations = () => {
	const { productId } = useParams()
	const [product, setProduct] = useState(null)
	// Khởi tạo variations ban đầu là rỗng, sau fetch sẽ set lại danh sách variation đã có (với isExisting: true)
	const [productVariations, setVariations] = useState([])
	const [initialVariations, setInitialVariations] = useState([])
	const [sizes, setSizes] = useState([])
	const [colors, setColors] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const varToken = useAuthHeader()
	const navigate = useNavigate()
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		if (productId) {
			apiClient
				.get(`/api/products/${productId}/detail`, { headers: { Authorization: varToken } })
				.then((response) => {
					setProduct(response.data)
					if (response.data.productVariations && response.data.productVariations.length > 0) {
						const mappedVariations = response.data.productVariations.map((variation) => ({
							id: variation.id, // Giữ lại id của variation đã có
							sizeId: variation.size.id,
							colorId: variation.color.id,
							productPrice: variation.variationPrice,
							productVariationImage: variation.variationImage,
							isImageRequired: false,
							isExisting: true, // Đánh dấu variation này là đã tồn tại
						}))
						setVariations(mappedVariations)
						setInitialVariations(mappedVariations)
					}
				})
				.catch((error) => {
					console.error('Error fetching product details:', error)
					toast.error('Failed to fetch product details')
				})
		}

		apiClient
			.get('/api/sizes', { headers: { Authorization: varToken } })
			.then((response) => setSizes(response.data))
			.catch((error) => console.error('Failed to fetch sizes', error))

		apiClient
			.get('/api/colors', { headers: { Authorization: varToken } })
			.then((response) => setColors(response.data))
			.catch((error) => console.error('Failed to fetch colors', error))
	}, [productId, varToken])

	// Cập nhật variation (chỉ cho variation mới, không cho variation đã có)
	const handleVariationChange = (index, field, value) => {
		if (productVariations[index].isExisting) return

		const newVariations = [...productVariations]
		if (field === 'productPrice') {
			newVariations[index][field] = value === '' ? '' : Number(value)
		} else {
			newVariations[index][field] = value
		}
		setVariations(newVariations)
	}

	// Thêm variation mới (isExisting: false)
	const handleAddVariation = () => {
		setVariations([
			...productVariations,
			{
				sizeId: '',
				colorId: '',
				productPrice: '',
				productVariationImage: null,
				isImageRequired: true,
				isExisting: false,
			},
		])
	}

	// Chỉ cho phép xóa variation mới (isExisting: false)
	const handleRemoveVariation = (index) => {
		if (!productVariations[index].isExisting) {
			setVariations(productVariations.filter((_, i) => i !== index))
		}
	}

	// Hàm upload ảnh qua imgbb
	const uploadImage = (file) => {
		const formData = new FormData()
		formData.append('image', file)
		return toast.promise(
			fetch('https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912', {
				method: 'POST',
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						return data.data.display_url
					} else {
						throw new Error('Image upload failed')
					}
				}),
			{
				pending: 'Uploading image...',
				success: 'Image uploaded successfully!',
				error: 'Image upload failed',
			},
			{ position: 'bottom-right' }
		)
	}

	// Xử lý chọn ảnh cho variation (chỉ cho variation mới)
	const handleImageChange = (index, event) => {
		if (productVariations[index].isExisting) return

		const file = event.target.files[0]
		if (!file) {
			const newVariations = [...productVariations]
			newVariations[index].isImageRequired = true
			setVariations(newVariations)
			return
		}
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file.')
			return
		}
		const newVariations = productVariations.map((variation, i) =>
			i === index
				? { ...variation, productVariationImage: file, isImageRequired: false }
				: variation
		)
		setVariations(newVariations)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			// Với các variation mới có ảnh là File, tiến hành upload ảnh
			const processedVariations = await Promise.all(
				productVariations.map(async (variation, index) => {
					if (!variation.isExisting && variation.productVariationImage instanceof File) {
						const imageUrl = await uploadImage(variation.productVariationImage)
						return { ...variation, productVariationImage: imageUrl }
					}
					return variation
				})
			)

			// Map payload theo định dạng API yêu cầu
			const apiVariations = processedVariations.map((variation) => ({
				id: variation.id,
				sizeId: variation.sizeId,
				colorId: variation.colorId,
				productPrice: variation.productPrice,
				productVariationImage: variation?.productVariationImage,
			}))

			const updatedProductData = {
				productId: product?.productId,
				productName: product?.productName,
				productCode: product?.productCode,
				productDescription: product?.productDescription,
				createdAt: product?.createdAt,
				updatedAt: product?.updatedAt,
				brandId: product?.brandId,
				productStatusId: product?.productStatusId,
				categoryIdList: product?.categoryIdList,
				productPrice: product?.productPrice,
				variations: apiVariations,
			}

			apiClient.post(`/api/products/${productId}/product-variations`, updatedProductData, {
				headers: { Authorization: varToken },
			})

			toast.success('Product variations updated successfully!', {
				position: 'bottom-right',
				transition: Zoom,
			})
			navigate(`/Dashboard/Products/${productId}`)
		} catch (error) {
			console.error('Error in submit:', error)
			toast.error(error.message || 'Failed to update product variations', {
				position: 'bottom-right',
				transition: Zoom,
			})
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='p-4 space-y-6'>
			<h1 className='text-2xl font-bold'>Update Product Variations</h1>
			{product && (
				<>
					<TextField label='Product Name' fullWidth value={product.productName} disabled />
					<TextField
						label='Product Description'
						fullWidth
						multiline
						rows={4}
						value={product.productDescription}
						disabled
					/>
				</>
			)}
			<h2 className='text-xl font-semibold'>Product Variations</h2>
			{productVariations.map((variation, index) => (
				<Box key={index} className='p-4 border rounded space-y-4'>
					<FormControl fullWidth>
						<InputLabel id={`size-label-${index}`}>Size</InputLabel>
						<Select
							labelId={`size-label-${index}`}
							value={variation.sizeId}
							onChange={(e) => handleVariationChange(index, 'sizeId', e.target.value)}
							disabled={isSubmitting || variation.isExisting}
							label='Size'
							required
						>
							{sizes.map((size) => (
								<MenuItem key={size.id} value={size.id}>
									{size.sizeName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel id={`color-label-${index}`}>Color</InputLabel>
						<Select
							labelId={`color-label-${index}`}
							value={variation.colorId}
							onChange={(e) => handleVariationChange(index, 'colorId', e.target.value)}
							disabled={isSubmitting || variation.isExisting}
							label='Color'
							required
						>
							{colors.map((color) => (
								<MenuItem key={color.id} value={color.id}>
									<span
										style={{ backgroundColor: color.colorHexCode, marginRight: 8 }}
										className='w-4 h-4 inline-block rounded-full'
									/>
									{color.colorName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label='Price'
						type='text' // Dùng text để kiểm soát đầu vào tốt hơn
						fullWidth
						value={variation.productPrice}
						onChange={(e) => {
							let value = e.target.value.replace(/[^0-9]/g, '') // Chặn ký tự không phải số
							if (value !== '') {
								value = Number(value)
								if (value > 99999999) {
									setErrorMessage('*Price from 0 to 99999999')
								} else {
									setErrorMessage('') // Xóa lỗi nếu hợp lệ
								}
								value = Math.min(99999999, value) // Giữ giá trị trong khoảng
							}
							handleVariationChange(index, 'productPrice', value)
						}}
						required
						inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Hỗ trợ mobile keyboard chỉ nhập số
						disabled={isSubmitting || variation.isExisting}
						error={!!errorMessage} // Hiển thị lỗi trên TextField
						helperText={errorMessage} // Hiển thị nội dung lỗi
					/>
					<Button
						variant='outlined'
						component='label'
						disabled={isSubmitting || variation.isExisting}
					>
						Upload Image
						<input type='file' hidden onChange={(e) => handleImageChange(index, e)} />
					</Button>
					{variation.isImageRequired && !variation.productVariationImage && (
						<FormHelperText error>Image is required</FormHelperText>
					)}
					{variation.productVariationImage &&
						(typeof variation.productVariationImage === 'object' ? (
							<img
								src={URL.createObjectURL(variation.productVariationImage)}
								alt='Product Variation'
								className='mt-2 w-20 h-20 object-cover rounded'
							/>
						) : (
							<img
								src={variation.productVariationImage}
								alt='Product Variation'
								className='mt-2 w-20 h-20 object-cover rounded'
							/>
						))}
					{/* Chỉ cho phép xóa variation mới */}
					{!variation.isExisting && (
						<IconButton
							onClick={() => handleRemoveVariation(index)}
							color='error'
							aria-label='delete variation'
						>
							<DeleteIcon />
						</IconButton>
					)}
				</Box>
			))}
			<Button variant='outlined' onClick={handleAddVariation} disabled={isSubmitting}>
				Add Variation
			</Button>
			<Button
				className='ml-5'
				type='submit'
				variant='contained'
				color='primary'
				disabled={
					isSubmitting ||
					(productVariations.length > 0 &&
						!productVariations[productVariations.length - 1].productVariationImage)
				}
			>
				Submit
			</Button>
		</form>
	)
}

export default DashboardAddProductVariations
