import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api'
import ReviewStars from '../../components/reviewStars/ReviewStars'
import { jwtDecode } from 'jwt-decode' // Import đúng tên hàm được xuất ra
import {
	Breadcrumbs,
	Typography,
	Pagination,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material'
import MainLayout from '../../layouts/MainLayout'
import { useProduct } from '../../components/Providers/Product'
import ReviewItem from '../../components/review/ReviewItem'
import { getDashboardReviews } from '../../service/ReviewService'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

const DashboardReview = () => {
	const [dashboardReviews, setDashboardReviews] = useState([])
	const [page, setPage] = useState(0)
	const [totalPages, setTotalPages] = useState(1)
	const [totalElements, setTotalElements] = useState(0)
	const [openDialog, setOpenDialog] = useState(false)
	const [newComment, setNewComment] = useState('')
	const [commentParentId, setCommentParentId] = useState(null)
	const authHeader = useAuthHeader()
	const token = authHeader ? authHeader.split(' ')[1] : null
	const username = token ? jwtDecode(token).sub : null
	const [productIdReply, setProductIdReply] = useState()
	const [commentError, setCommentError] = useState('')

	const cleanImageUrl = (url) => {
		if (!url) return ''
		if (url.includes('lh3.googleusercontent.com')) {
			return url.split('=')[0]
		}
		return url
	}
	const fetchDashboardReviews = async () => {
		try {
			const data = await getDashboardReviews(page, 10, authHeader)
			setDashboardReviews(data.content)
			setTotalPages(data.totalPages)
			setTotalElements(data.totalElements)
			console.log(data.content)
		} catch (error) {
			console.error('Error fetching dashboard reviews:', error)
		}
	}
	useEffect(() => {
		fetchDashboardReviews()
	}, [page, authHeader])

	const handlePageChange = (event, value) => {
		setPage(value - 1)
	}

	const handlePostComment = async () => {
		try {
			if (!newComment.trim()) {
				setCommentError('Comment content cannot be empty.')
				return
			}
			await apiClient.post(
				'api/comments/admin',
				{
					username: username,
					commentParentId: commentParentId,
					productId: productIdReply,
					comment: {
						id: 0,
						commentContent: newComment,
						commentCreatedAt: new Date().toISOString(),
						commentUpdatedAt: new Date().toISOString(),
					},
				},
				{ headers: { Authorization: authHeader } }
			)
			setOpenDialog(false)
			setNewComment('')
			setCommentParentId(null)
			fetchDashboardReviews()
		} catch (error) {
			console.error('Error posting comment:', error)
			setCommentError('Failed to post comment. Please try again.')
		}
	}

	return (
		<MainLayout>
			<div className='container mx-auto px-4 py-8'>
				<div className='flex items-center justify-between mb-6'>
					<h1 className='text-4xl font-bold'>Product Reviews Dashboard</h1>
				</div>

				{dashboardReviews && dashboardReviews.length > 0 ? (
					<ul className='space-y-4'>
						{dashboardReviews.map((review) => (
							<li
								key={review.commentId}
								className='border p-4 rounded-md shadow-sm grid grid-cols-3 gap-4'
							>
								{/* Cột bên trái */}
								<div className='flex flex-col'>
									<div className='flex items-center mb-2'>
										<p className='mr-4'>
											<strong>{review.fullName}</strong>
										</p>
										{review.userImage && (
											<img
												src={cleanImageUrl(review.userImage)}
												className='w-8 h-auto rounded-full'
												referrerPolicy='no-referrer'
											/>
										)}
									</div>
									<p className='text-sm text-gray-500'>
										{new Date(review.createdAt).toLocaleDateString()}
									</p>
									<p>
										<strong>Comment:</strong> {review.commentContent}
									</p>
									{/* Nút Reply cho từng comment */}
									<Button
										variant='outlined'
										size='small'
										className='mt-2'
										onClick={() => {
											setProductIdReply(review.productId)
											setCommentParentId(review.commentId)
											setOpenDialog(true)
										}}
										disabled={review.maxReply}
									>
										Reply
									</Button>
									{review.maxReply && (
										<Typography variant="caption" color="error">
											Max replies reached
										</Typography>
									)}
								</div>

								{/* Cột bên phải */}
								<div className='flex flex-col items-start'>
									<p>
										<strong>Product Name:</strong> {review.productName}
									</p>
									{review.reviewRating !== null && (
										<p>
											<strong>Rating:</strong> <ReviewStars rating={review.reviewRating} />
										</p>
									)}
									{review.parentCommentContent && (
										<p>
											<strong>Replied to:</strong> {review.parentCommentContent}
										</p>
									)}
								</div>

								{/* Cột cuối cùng - ảnh variationImage */}
								<div className='flex justify-center items-center'>
									<Link to={`/Dashboard/Product-Reviews/${review.productId}`}>
										{review.variationImage && (
											<img
												src={review.variationImage}
												alt={`Variation for ${review.productName}`}
												className='w-32 h-32 object-cover'
											/>
										)}
									</Link>
								</div>
							</li>
						))}
					</ul>
				) : (
					<Typography>No reviews available.</Typography>
				)}

				{totalPages > 1 && (
					<div className='flex justify-center mt-8'>
						<Pagination
							count={totalPages}
							page={page + 1}
							onChange={handlePageChange}
							variant='outlined'
							shape='rounded'
						/>
					</div>
				)}
			</div>

			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				PaperProps={{
					style: {
						width: '30%', // hoặc bạn có thể đặt giá trị theo ý muốn
						maxWidth: 'none', // loại bỏ giới hạn mặc định của Material-UI
					},
				}}
			>
				<DialogTitle>Post a Comment</DialogTitle>
				<DialogContent style={{ paddingTop: '10px' }}>
					<TextField
						fullWidth
						multiline
						rows={6}
						label='Comment'
						value={newComment}
						onChange={(e) => {
							const value = e.target.value
							if (value.length > 500) {
								setCommentError('Comment content must not exceed 500 characters.')
							} else {
								setCommentError('')
								setNewComment(value)
							}
						}}
						autoFocus
						variant='outlined'
						error={!!commentError}
						helperText={commentError}
					/>
					<Typography variant='caption' align='right' display='block' style={{ marginTop: 8 }}>
						{newComment.length}/500
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpenDialog(false)
							setNewComment('')
						}}
					>
						Cancel
					</Button>
					<Button onClick={handlePostComment} color='primary' variant='contained'>
						Post
					</Button>
				</DialogActions>
			</Dialog>
		</MainLayout>
	)
}

export default DashboardReview
