import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api'
import { toast, Zoom } from 'react-toastify'
import {
	Container,
	Typography,
	TextField,
	Button,
	Box,
	InputLabel,
	MenuItem,
	Select,
	FormControl,
	CircularProgress,
} from '@mui/material'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

const DashboardEditProductVariation = () => {
	const { productId, productVariationId } = useParams()
	const navigate = useNavigate()
	const varToken = useAuthHeader()

	// Đổi tên state để đồng nhất với API
	const [sizeId, setSizeId] = useState('')
	const [colorId, setColorId] = useState('')
	const [variationPrice, setVariationPrice] = useState('')
	const [variationImageFile, setVariationImageFile] = useState(null)
	const [currentImageUrl, setCurrentImageUrl] = useState('')
	const [newImagePreview, setNewImagePreview] = useState(null)

	const [sizes, setSizes] = useState([])
	const [colors, setColors] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const fetchProductVariation = async () => {
			try {
				const response = await apiClient.get(`/api/product-variations/${productVariationId}`, {
					headers: { Authorization: varToken },
				})

				const { size, color, variationPrice, variationImage } = response.data
				console.log(response.data)
				setSizeId(size.id)
				setColorId(color.id)
				setVariationPrice(variationPrice)
				setCurrentImageUrl(variationImage)
			} catch (error) {
				console.error('Error fetching product variation data:', error)
			}
		}

		const fetchSizesAndColors = async () => {
			try {
				const sizesResponse = await apiClient.get('/api/sizes', {
					headers: { Authorization: varToken },
				})
				const colorsResponse = await apiClient.get('/api/colors', {
					headers: { Authorization: varToken },
				})
				setSizes(sizesResponse.data)
				setColors(colorsResponse.data)
			} catch (error) {
				console.error('Error fetching sizes and colors:', error)
			}
		}

		fetchProductVariation()
		fetchSizesAndColors()
	}, [productVariationId, varToken])

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		setVariationImageFile(file)
		setNewImagePreview(URL.createObjectURL(file))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)

		try {
			let imageUrl = currentImageUrl

			if (variationImageFile) {
				const formData = new FormData()
				formData.append('image', variationImageFile)
				const uploadResponse = await fetch(
					'https://api.imgbb.com/1/upload?key=387abfba10f808a7f6ac4abb89a3d912',
					{ method: 'POST', body: formData }
				)
				const uploadData = await uploadResponse.json()
				if (uploadData.success) {
					imageUrl = uploadData.data.display_url
				} else {
					throw new Error('Image upload failed')
				}
			}

			await apiClient.put(
				`/api/product-variations/${productVariationId}`,
				{ sizeId, colorId, productPrice: variationPrice, productVariationImage: imageUrl },
				{ headers: { Authorization: varToken } }
			)

			toast.success('Product Variation updated successfully', {
				position: 'bottom-right',
				transition: Zoom,
			})
			navigate(`/Dashboard/Products/${productId}`)
		} catch (error) {
			toast.error('Update failed', {
				position: 'bottom-right',
				transition: Zoom,
			})
			console.error('Error updating product variation:', error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Container maxWidth='sm' sx={{ p: 4, backgroundColor: 'white', borderRadius: 2, boxShadow: 3 }}>
			<Typography variant='h4' gutterBottom>
				Edit Product Variation
			</Typography>
			<form onSubmit={handleSubmit}>
				<FormControl fullWidth margin='normal'>
					<InputLabel id='size-label'>Size</InputLabel>
					<Select
						labelId='size-label'
						value={sizeId}
						onChange={(e) => setSizeId(e.target.value)}
						required
						label='Size'
					>
						{sizes.map((size) => (
							<MenuItem key={size.id} value={size.id}>
								{size.sizeName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl fullWidth margin='normal'>
					<InputLabel id='color-label'>Color</InputLabel>
					<Select
						labelId='color-label'
						value={colorId}
						onChange={(e) => setColorId(e.target.value)}
						required
						label='Color'
					>
						{colors.map((color) => (
							<MenuItem key={color.id} value={color.id}>
								{color.colorName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label='Variation Price'
					variant='outlined'
					fullWidth
					margin='normal'
					value={variationPrice}
					onChange={(e) => setVariationPrice(e.target.value)}
					type='number'
					required
					onBlur={(e) => {
						const value = parseFloat(e.target.value)
						if (value < 0) {
							setVariationPrice(0)
						} else if (value > 999999999999) {
							setVariationPrice(999999999999)
						}
					}}
					inputProps={{ min: 0, max: 999999999999 }}
				/>

				<InputLabel htmlFor='variationImage' sx={{ mt: 2 }}>
					Variation Image (Leave blank to keep current image)
				</InputLabel>
				<Button variant='outlined' component='label' sx={{ mt: 1 }}>
					Upload Image
					<input type='file' accept='image/*' onChange={handleImageChange} hidden />
				</Button>

				{newImagePreview ? (
					<Box mt={2} display='flex' flexDirection='column' alignItems='center'>
						<img
							src={newImagePreview}
							alt='New Image Preview'
							style={{
								width: 150,
								height: 150,
								objectFit: 'cover',
								borderRadius: 8,
							}}
						/>
						<Typography variant='body2' color='textSecondary' mt={1}>
							New Image Preview
						</Typography>
					</Box>
				) : (
					currentImageUrl && (
						<Box mt={2} display='flex' flexDirection='column' alignItems='center'>
							<img
								src={currentImageUrl}
								alt='Current Image'
								style={{
									width: 150,
									height: 150,
									objectFit: 'cover',
									borderRadius: 8,
								}}
							/>
							<Typography variant='body2' color='textSecondary' mt={1}>
								Current Image
							</Typography>
						</Box>
					)
				)}

				<Box mt={3}>
					<Button type='submit' variant='contained' color='primary' fullWidth disabled={loading}>
						{loading ? <CircularProgress size={24} color='inherit' /> : 'Update Product Variation'}
					</Button>
				</Box>
			</form>
		</Container>
	)
}

export default DashboardEditProductVariation
