import React, { useEffect, useState } from 'react'
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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { useNavigate } from 'react-router-dom'
import { toast, Zoom } from 'react-toastify'
import { InputAdornment } from '@mui/material'

const DashboardAddProducts = () => {
	const [productName, setProductName] = useState('')
	const [productDescription, setProductDescription] = useState('')
	const [categoryIdList, setCategoryIdList] = useState([])
	const [brandId, setBrandId] = useState('')
	const [sizes, setSizes] = useState([])
	const [categories, setCategories] = useState([])
	const [brands, setBrands] = useState([])
	const [colors, setColors] = useState([])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isImageRequired, setIsImageRequired] = useState(true)
	const [variations, setVariations] = useState([
		{ sizeId: '', colorId: '', productPrice: 0, productVariationImage: null },
	])
	const navigate = useNavigate()
	const varToken = useAuthHeader()
	const [errorMessage, setErrorMessage] = useState('')

	useEffect(() => {
		apiClient.get('/api/sizes', { headers: { Authorization: varToken } }).then((response) => {
			console.log('Sizes Response:', response)
			setSizes(response.data)
		})

		apiClient.get('/api/categories', { headers: { Authorization: varToken } }).then((response) => {
			console.log('Categories Response:', response)
			setCategories(response.data)
		})

		apiClient.get('/api/brands', { headers: { Authorization: varToken } }).then((response) => {
			console.log('Brands Response:', response)
			setBrands(response.data)
		})

		apiClient.get('/api/colors', { headers: { Authorization: varToken } }).then((response) => {
			console.log('Colors Response:', response)
			setColors(response.data)
		})
	}, [varToken])

	const handleVariationChange = (index, field, value) => {
		const newVariations = [...variations]
		newVariations[index][field] = value
		setVariations(newVariations)
	}

	const handleAddVariation = () => {
		setVariations([
			...variations,
			{ sizeId: '', colorId: '', productPrice: '', productVariationImage: null },
		])
	}

	const handleRemoveVariation = (index) => {
		setVariations(variations.filter((_, i) => i !== index))
	}

	const handleSetCategoryId = (value) => {
		console.log('Selected Category:', value)
		setCategoryIdList([value])
	}

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
			{
				position: 'bottom-right',
			}
		)
	}

	const handleImageChange = (index, event) => {
		const file = event.target.files[0]
		if (file) {
			const newVariations = [...variations]
			newVariations[index].productVariationImage = file
			setVariations(newVariations)
			setIsImageRequired(false)
		} else {
			setIsImageRequired(true)
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (variations.length === 0) {
			toast.error('At least one variation is required!', {
				position: 'bottom-right',
				transition: Zoom,
			})
			return
		}

		setIsSubmitting(true)

		const uploadedVariations = await Promise.all(
			variations.map(async (variation) => {
				if (variation.productVariationImage) {
					const imageUrl = await uploadImage(variation.productVariationImage)
					return { ...variation, productVariationImage: imageUrl }
				}
				return variation
			})
		)

		const productData = {
			productName,
			productDescription,
			categoryIdList,
			brandId,
			variations: uploadedVariations,
		}

		try {
			await apiClient.post('/api/products', productData, {
				headers: { Authorization: varToken },
			})
			toast.success('Product added successfully!', { position: 'bottom-right', transition: Zoom })
			navigate('/Dashboard/Products')
		} catch (error) {
			toast.error(error.message || 'Failed to add product', {
				position: 'bottom-right',
				transition: Zoom,
			})
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className='p-4 space-y-6'>
			<h1 className='text-2xl font-bold'>Add Product</h1>
			<TextField
				label='Product Name'
				fullWidth
				value={productName}
				onChange={(e) => {
					if (e.target.value.length <= 100) {
						setProductName(e.target.value)
					}
				}}
				required
				disabled={isSubmitting}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end' style={{ fontSize: '12px', color: 'gray' }}>
							{productName.length}/100
						</InputAdornment>
					),
				}}
			/>
			<TextField
				label='Product Description'
				fullWidth
				multiline
				rows={4}
				value={productDescription}
				onChange={(e) => {
					if (e.target.value.length <= 300) {
						setProductDescription(e.target.value)
					}
				}}
				required
				disabled={isSubmitting}
				InputProps={{
					endAdornment: (
						<InputAdornment position='end' style={{ fontSize: '12px', color: 'gray' }}>
							{productDescription.length}/300
						</InputAdornment>
					),
				}}
			/>
			<FormControl fullWidth>
				<InputLabel id='category-label'>Category</InputLabel>
				<Select
					labelId='category-label'
					multiple
					value={categoryIdList}
					onChange={(e) => {
						const selectedValues = e.target.value
						setCategoryIdList(Array.isArray(selectedValues) ? selectedValues : [selectedValues])
					}}
					required
					disabled={isSubmitting}
					label='Category'
					renderValue={(selected) =>
						selected.length === 0 ? (
							<em></em>
						) : (
							categories
								.filter((category) => selected.includes(category.id))
								.map((category) => category.categoryName)
								.join(', ')
						)
					}
				>
					{categories.map((category) => (
						<MenuItem key={category.id} value={category.id}>
							{category.categoryName}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<FormControl fullWidth>
				<InputLabel id='brand-label'>Brand</InputLabel>
				<Select
					labelId='brand-label'
					value={brandId}
					onChange={(e) => setBrandId(e.target.value)}
					required
					disabled={isSubmitting}
					label='Brand'
				>
					{brands.map((brand) => (
						<MenuItem key={brand.brandId} value={brand.brandId}>
							{brand.brandName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<h2 className='text-xl font-semibold'>Product Variations</h2>
			{variations.map((variation, index) => (
				<Box key={index} className='p-4 border rounded space-y-4'>
					<FormControl fullWidth>
						<InputLabel id={`size-label-${index}`}>Size</InputLabel>
						<Select
							labelId={`size-label-${index}`}
							value={variation.sizeId}
							onChange={(e) => handleVariationChange(index, 'sizeId', e.target.value)}
							required
							disabled={isSubmitting}
							label='Size'
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
							required
							disabled={isSubmitting}
							label='Color'
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
						disabled={isSubmitting}
						error={!!errorMessage} // Hiển thị lỗi trên TextField
						helperText={errorMessage} // Hiển thị nội dung lỗi
					/>

					<Button variant='outlined' component='label'>
						Upload Image
						<input
							type='file'
							hidden
							onChange={(e) => handleImageChange(index, e)}
							required
							disabled={isSubmitting}
						/>
					</Button>
					{isImageRequired && <div className='text-red-500'>Image is required</div>}
					{variation.productVariationImage && (
						<img
							src={URL.createObjectURL(variation.productVariationImage)}
							alt='Product Variation'
							className='mt-2 w-20 h-20 object-cover rounded'
						/>
					)}
					<IconButton
						onClick={() => handleRemoveVariation(index)}
						color='error'
						aria-label='delete variation'
					>
						<DeleteIcon />
					</IconButton>
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
				disabled={isSubmitting}
			>
				Submit
			</Button>
		</form>
	)
}

export default DashboardAddProducts
