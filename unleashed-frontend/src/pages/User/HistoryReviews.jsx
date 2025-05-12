import {
	Box,
	Button,
	CircularProgress,
	Divider,
	Grid2,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
	CardContent,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import UserSideMenu from '../../components/menus/UserMenu'
import { getMyReviews } from '../../service/UserService'

const ReviewHistory = () => {
	const authHeader = useAuthHeader()
	const user = useAuthUser()
	const [reviews, setReviews] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const response = await getMyReviews(authHeader, user?.username)
				if (response?.data) {
					setReviews(response.data)
				}
			} catch (error) {
				console.error('Error fetching reviews:', error)
			} finally {
				setLoading(false)
			}
		}
		fetchReviews()
	}, [authHeader, user])

	// Function to select background color based on rating
	const getCardBackgroundColor = (rating) => {
		if (rating >= 1 && rating <= 2) return '#ffebee' // 🔴 Light Red
		if (rating >= 3 && rating <= 4) return '#fff3e0' // 🟠 Light Orange
		return '#e8f5e9' // 🟢 Light Green (rating === 5)
	}

	return (
		<Grid2 container spacing={2}>
			<Grid2 size={4}>
				<UserSideMenu />
			</Grid2>

			<Grid2 size={7.5}>
				<Typography variant='h4' fontWeight='bold' gutterBottom>
					Review History
				</Typography>
				<Divider sx={{ mb: 2 }} />

				{loading ? (
					<Box display='flex' justifyContent='center'>
						<CircularProgress size={50} color='secondary' />
					</Box>
				) : reviews.length > 0 ? (
					<Box>
						{reviews.map((review) => (
							<Card
								key={review.productId}
								sx={{ mb: 2, backgroundColor: getCardBackgroundColor(review.reviewRating) }}
							>
								<CardContent>
									<TableContainer component={Paper}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell sx={{ width: '33%', fontWeight: 'bold', textAlign: 'center' }}>
														Product & Time
													</TableCell>
													<TableCell sx={{ width: '33%', fontWeight: 'bold', textAlign: 'center' }}>
														Comment
													</TableCell>
													<TableCell sx={{ width: '33%', fontWeight: 'bold', textAlign: 'center' }}>
														Rating & View
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												<TableRow>
													{/* Cột 1: Product & Time */}
													<TableCell sx={{ textAlign: 'center', paddingBottom: 2 }}>
														<Typography variant='h6' fontWeight='bold'>
															{review.product.productName}
														</Typography>
														{review.comments.length > 0 && (
															<Typography variant='caption' color='textSecondary'>
																{new Date(review.comments[0].commentCreatedAt).toLocaleString()}
															</Typography>
														)}
													</TableCell>

													{/* Cột 2: Comment */}
													<TableCell sx={{ textAlign: 'center' }}>
														{review.comments.length > 0 ? (
															<Typography variant='body2'>
																{review.comments[0].commentContent}
															</Typography>
														) : (
															<Typography variant='body2' color='textSecondary'>
																No comments available
															</Typography>
														)}
													</TableCell>

													{/* Cột 3: Rating & View */}
													<TableCell sx={{ textAlign: 'center' }}>
														<Box display='flex' flexDirection='column' alignItems='center'>
															<Typography variant='body1' fontWeight='medium'>
																Rating: {review.reviewRating} / 5⭐
															</Typography>
															<Button
																component={Link}
																to={`/shop/product/${review.product.productId}`}
																variant='contained'
																color='primary'
																sx={{
																	fontSize: '0.8rem',
																	fontWeight: 'bold',
																	mt: 1,
																	px: 1.5,
																	py: 0.5,
																}}
															>
																View Product
															</Button>
														</Box>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</CardContent>
							</Card>
						))}
					</Box>
				) : (
					<Typography>No reviews found.</Typography>
				)}
			</Grid2>
		</Grid2>
	)
}

export default ReviewHistory
