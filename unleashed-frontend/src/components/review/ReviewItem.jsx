import React, { useState, useEffect } from 'react'
import ReviewStars from '../../components/reviewStars/ReviewStars'
import CommentItem from './CommentItem' // Import CommentItem
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { jwtDecode } from 'jwt-decode' // Import thư viện decode JWT
import { apiClient } from '../../core/api'
import { toast } from 'react-toastify'
import { Zoom } from 'react-toastify'
import unleashed from '../../assets/images/logo.png'
const ReviewItem = ({ review, product }) => {
	const [isReplying, setIsReplying] = useState(false)
	const [replyContent, setReplyContent] = useState('')
	const [comments, setComments] = useState(review.childComments || []) // Dữ liệu comment ban đầu từ props
	const [showAllReplies, setShowAllReplies] = useState(false); // Thêm state này

	const [isEditingReview, setIsEditingReview] = useState(false) // Thêm state cho chỉnh sửa review
	const [editedReviewContent, setEditedReviewContent] = useState(review.reviewComment || '') // State cho nội dung chỉnh sửa review

	const handleReplyClick = () => {
		setIsReplying(!isReplying)
	}

	const authHeader = useAuthHeader()
	const token = authHeader ? authHeader.split(' ')[1] : null
	const username = token ? jwtDecode(token).sub : null

	// Fetch danh sách comment từ API
	const fetchComments = async () => {
		try {
			const response = await apiClient.get(`/api/reviews/${review.reviewId}/comments`)
			setComments(response.data) // Cập nhật danh sách comment
		} catch (error) {
			console.error('Failed to fetch comments:', error)
		}
	}

	// Gửi comment mới lên API
	const handleSubmitReply = async () => {
		if (!replyContent.trim()) return

		const newCommentData = {
			username: username,
			commentParentId: review.commentId, // Đặt parent là reviewId (comment gốc)
			productId: product,
			comment: {
				id: 0,
				commentContent: replyContent,
				commentCreatedAt: new Date().toISOString(),
				commentUpdatedAt: new Date().toISOString(),
			},
		}
		console.log(newCommentData)

		try {
			await apiClient.post('/api/comments', newCommentData)
			toast.success('Comment posted successfully!', { position: 'top-left', transition: Zoom })
			// Cập nhật danh sách comment sau khi post thành công
			setReplyContent('')
			setIsReplying(false)
			setTimeout(() => {
				window.location.reload()
			}, 1) // Chờ 0.5s để toast hiển thị trước khi reload
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to post comment! Please try again.', {
				position: 'top-left',
				transition: Zoom,
			})
		}
	}

	useEffect(() => {
		fetchComments() // Lấy danh sách comment khi component mount
	}, [])

	const handleUpdateReviewClick = () => {
		setIsEditingReview(true)
		setEditedReviewContent(review.reviewComment) // Khởi tạo nội dung chỉnh sửa
	}

	const handleCancelUpdateReview = () => {
		setIsEditingReview(false)
	}

	const handleSaveUpdateReview = async () => {
		try {
			const response = await apiClient.put(
				`/api/reviews/comments/${review.commentId}?username=${username}`,
				{
					commentContent: editedReviewContent,
				}
			)
			if (response.status === 200) {
				toast.success('Review updated successfully!', { position: 'top-left', transition: Zoom })
				setIsEditingReview(false)
				// Cập nhật lại review hiển thị (có thể fetch lại review hoặc cập nhật state cục bộ)
				review.reviewComment = editedReviewContent // Cập nhật trực tiếp để hiển thị ngay lập tức
				// Có thể cần cập nhật lại commentUpdatedAt để nút Update biến mất nếu cần logic chặt chẽ hơn
				review.updatedAt = new Date().toISOString() // Cập nhật updatedAt
			} else {
				toast.error('Failed to update review.', { position: 'top-left', transition: Zoom })
			}
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to update review! Please try again.', {
				position: 'top-left',
				transition: Zoom,
			})
		}
	}

	const isReviewUpdated =
		review.updatedAt !== undefined && review.createdAt.toString() !== review.updatedAt.toString()

	return (
		<div className='mb-6 last:mb-0 pb-6 last:pb-6 border border-gray-300 rounded-lg p-6 bg-gray-100'>
			<div className='mb-4 p-3 rounded-md bg-gray-50 border border-gray-200'>
				<div className='flex justify-between items-start mb-2'>
					<div className='flex items-center'>
						<h4 className='font-semibold text-lg mr-2'>{review.fullName}</h4>
						{review.userImage && (
							<img
								src={review.userImage}
								alt={`${review.fullName}'s Profile`}
								className='w-8 h-8 rounded-full object-cover'
								onError={(e) => {
									e.target.onerror = null
									e.target.src = unleashed
								}}
							/>
						)}
					</div>
					<div className='flex items-center'>
						{review.reviewRating != null && review.reviewRating > 0 && (
							<ReviewStars rating={review.reviewRating} />
						)}
					</div>
				</div>
				{isEditingReview ? (
					<textarea
						value={editedReviewContent}
						onChange={(e) => setEditedReviewContent(e.target.value)}
						className='w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
						rows='3'
					/>
				) : (
					review.reviewComment && (
						<>
							<p className='text-sm text-gray-500 mt-1 text-left'>
								{new Date(review.createdAt).toLocaleDateString()}
								{isReviewUpdated && (
									<span className='text-gray-500 text-xs ml-1'>
										(Updated at: {new Date(review.updatedAt).toLocaleDateString()})
									</span>
								)}
							</p>
							<p className='mt-2 text-gray-700 break-words'>{review.reviewComment}</p>
						</>
					)
				)}
			</div>

			<div className='mt-2 flex items-center'>
				{username === review.fullName && !isReplying && !isEditingReview && !isReviewUpdated && (
					<button
						onClick={handleUpdateReviewClick}
						className='border border-gray-300 text-black font-semibold text-base px-3 py-1 rounded hover:scale-105 active:scale-100 transition-transform focus:outline-none mr-2'
					>
						Update
					</button>
				)}
				{isEditingReview && (
					<>
						<button
							onClick={handleSaveUpdateReview}
							className='bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none mr-2'
						>
							Save
						</button>
						<button
							onClick={handleCancelUpdateReview}
							className='text-gray-500 hover:underline text-sm focus:outline-none'
						>
							Cancel
						</button>
					</>
				)}
				{username && !isEditingReview && !isReplying && (
					<button
						onClick={handleReplyClick}
						className='border border-gray-300 text-black font-semibold text-base px-3 py-1 rounded hover:scale-105 active:scale-100 transition-transform focus:outline-none'
					>
						Reply
					</button>
				)}
			</div>

			{isReplying && (
				<div className='ml-0 mt-2'>
					<textarea
						placeholder='Write your reply...'
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						className='w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
						rows='2'
					/>
					<div className='mt-2 flex items-center'>
						<button
							onClick={handleSubmitReply}
							className='bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 focus:outline-none mr-2'
						>
							Submit Reply
						</button>
						<button
							onClick={() => setIsReplying(false)}
							className='ml-2 text-gray-500 hover:underline text-sm focus:outline-none'
						>
							Cancel
						</button>
					</div>
				</div>
			)}

{comments.length > 0 && (
    <div className='ml-6 mt-4 relative' style={{ position: 'relative' }}>
        <div
            style={{
                position: 'absolute',
                top: -10, // Điều chỉnh để đường thẳng bắt đầu từ trên comment cha
                left: -15, // Điều chỉnh vị trí đường thẳng
                bottom: 0,
                borderLeft: '2px dashed #ccc', // Màu và kiểu đường thẳng
            }}
        ></div>
        {showAllReplies ? (
            <>
                {comments.map((childComment, index) => (
                    <CommentItem key={index} comment={childComment} name={username} product={product} />
                ))}
                {comments.length > 3 && (
                    <button
                        onClick={() => setShowAllReplies(false)}
                        className='border border-gray-300 text-black-500 font-semibold px-3 hover:scale-105 transition-transform text-xs focus:outline-none mt-2 block'
                    >
                        Show less replies
                    </button>
                )}
            </>
        ) : (
            <>
                {comments.slice(0, 3).map((childComment, index) => (
                    <CommentItem key={index} comment={childComment} name={username} product={product} />
                ))}
                {comments.length > 3 && (
                    <button
                        onClick={() => setShowAllReplies(true)}
                        className='border border-gray-300 text-black-500 font-semibold px-3 hover:scale-105 transition-transform text-xs focus:outline-none mt-2 block'
                    >
                        Read all replies ({comments.length - 3}+)
                    </button>
                )}
            </>
        )}
    </div>
)}
		</div>
	)
}

export default ReviewItem
