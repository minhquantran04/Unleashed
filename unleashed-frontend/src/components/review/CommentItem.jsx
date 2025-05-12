import React, { useState, useEffect } from 'react'
import { apiClient } from '../../core/api'
import { toast } from 'react-toastify'
import { Zoom } from 'react-toastify'
import unleashed from '../../assets/images/logo.png'

const CommentItem = ({ comment, name, depth = 1, product }) => {
	const [isReplying, setIsReplying] = useState(false)
	const [replyContent, setReplyContent] = useState('')

	const [isEditingComment, setIsEditingComment] = useState(false) // State cho chỉnh sửa comment
	const [editedCommentContent, setEditedCommentContent] = useState(comment.reviewComment || '') // State cho nội dung chỉnh sửa comment
	const [isSaveDisabled, setIsSaveDisabled] = useState(true) // State để theo dõi trạng thái disable của nút Save
	const [showAllReplies, setShowAllReplies] = useState(false); // Thêm state này

	const handleReplyClick = () => {
		setIsReplying(!isReplying)
	}

	const handleSubmitReply = async () => {
		if (!replyContent.trim()) return

		const newCommentData = {
			username: name,
			commentParentId: comment.commentId,
			productId: product,
			comment: {
				id: 0,
				commentContent: replyContent,
				commentCreatedAt: new Date().toISOString(),
				commentUpdatedAt: new Date().toISOString(),
			},
		}

		try {
			await apiClient.post('/api/comments', newCommentData)
			setIsReplying(false)
			setReplyContent('')
			toast.success('Reply posted successfully!', { position: 'top-left', transition: Zoom })
			setTimeout(() => {
				window.location.reload()
			}, 5)
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to post comment! Please try again.', {
				position: 'top-left',
				transition: Zoom,
			})
		}
	}

	const handleUpdateCommentClick = () => {
		setIsEditingComment(true)
		setEditedCommentContent(comment.reviewComment)
	}

	const handleCancelUpdateComment = () => {
		setIsEditingComment(false)
	}

	const handleSaveUpdateComment = async () => {
		if (isSaveDisabled) {
			return
		}
		try {
			const response = await apiClient.put(
				`/api/reviews/comments/${comment.commentId}?username=${name}`,
				{
					commentContent: editedCommentContent,
				}
			)
			if (response.status === 200) {
				toast.success('Comment updated successfully!', { position: 'top-left', transition: Zoom })
				setIsEditingComment(false)
				comment.reviewComment = editedCommentContent
				comment.updatedAt = new Date().toISOString()
			} else {
				toast.error('Failed to update comment.', { position: 'top-left', transition: Zoom })
			}
		} catch (error) {
			toast.error(error.response?.data?.message || 'Failed to update comment! Please try again.', {
				position: 'top-left',
				transition: Zoom,
			})
		}
	}

	const isCommentUpdated =
		comment.updatedAt !== undefined && comment.createdAt.toString() !== comment.updatedAt.toString()

	useEffect(() => {
		setIsSaveDisabled(!editedCommentContent.trim()) // Disable nếu editedCommentContent rỗng sau khi trim
	}, [editedCommentContent])

	return (
		<div className='mb-1 p-3 rounded-md bg-gray-50'>
			<div className='flex justify-between items-start mb-1'>
				<div className='flex items-center'>
					<h6 className='font-semibold text-sm mr-2'>{comment.fullName}</h6>
					{comment.userImage && (
						<img
							src={comment.userImage}
							alt={`${comment.fullName}'s Profile`}
							className='w-8 h-8 rounded-full object-cover'
							onError={(e) => {
								e.target.onerror = null
								e.target.src = unleashed
							}}
						/>
					)}
				</div>
			</div>
			<p className='text-xs text-gray-500 mt-0 text-left'>
				{new Date(comment.createdAt).toLocaleDateString()}
				{isCommentUpdated && (
					<span className='text-gray-500 text-xs ml-1'>
						(Updated at: {new Date(comment.updatedAt).toLocaleDateString()})
					</span>
				)}
			</p>
			{isEditingComment ? (
				<textarea
					value={editedCommentContent}
					onChange={(e) => setEditedCommentContent(e.target.value)}
					className='w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs'
					rows='2'
				/>
			) : (
				<p className='mt-1 text-gray-600 break-words text-sm'>{comment.reviewComment}</p>
			)}

			<div className='mt-2 flex items-center'>
				{name === comment.fullName && !isEditingComment && !isCommentUpdated && !isReplying && (
					<button
						onClick={handleUpdateCommentClick}
						className='border border-gray-300 text-black font-semibold text-xs px-2 py-1 rounded hover:scale-105 active:scale-100 transition-transform mr-2'
					>
						Update
					</button>
				)}
				{isEditingComment && (
					<>
						<button
							onClick={handleSaveUpdateComment}
							className={`bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 mr-2 ${
								isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={isSaveDisabled}
						>
							Save
						</button>
						<button
							onClick={handleCancelUpdateComment}
							className='text-gray-500 hover:underline text-xs'
						>
							Cancel
						</button>
					</>
				)}
				{name && !isEditingComment && !isReplying && depth < 5 && (
					<button
						onClick={handleReplyClick}
						className='border border-gray-300 text-black font-semibold text-xs px-2 py-1 rounded hover:scale-105 active:scale-100 transition-transform mr-2'
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
						className='w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs'
						rows='2'
					/>
					<div className='mt-2 flex items-center'>
						<button
							onClick={handleSubmitReply}
							className='bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 mr-2'
						>
							Submit Reply
						</button>
						<button
							onClick={() => setIsReplying(false)}
							className='ml-2 text-gray-500 hover:underline text-xs'
						>
							Cancel
						</button>
					</div>
				</div>
			)}

{comment.childComments && comment.childComments.length > 0 && (
    <div className='ml-6 mt-2 relative' style={{ position: 'relative' }}>
        <div
            style={{
                position: 'absolute',
                top: -10, // Điều chỉnh để đường thẳng bắt đầu từ trên comment cha
                left: -15, // Điều chỉnh vị trí đường thẳng
                bottom: 0,
                borderLeft: '2px dashed #ccc', // Màu và kiểu đường thẳng dọc
            }}
        ></div>
        {showAllReplies ? (
            <>
                {comment.childComments.map((childComment, index) => (
                    <CommentItem key={index} comment={childComment} name={name} depth={depth + 1} product={product} />
                ))}
                {comment.childComments.length > 3 && (
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
                {comment.childComments.slice(0, 3).map((childComment, index) => (
                    <CommentItem key={index} comment={childComment} name={name} depth={depth + 1} product={product} />
                ))}
                {comment.childComments.length > 3 && (
                    <button
                        onClick={() => setShowAllReplies(true)}
                        className='border border-gray-300 text-black-500 font-semibold px-3 hover:scale-105 transition-transform text-xs focus:outline-none mt-2 block'
                    >
                        Read all replies ({comment.childComments.length - 3}+)
                    </button>
                )}
            </>
        )}
    </div>
)}
		</div>
	)
}

export default CommentItem
