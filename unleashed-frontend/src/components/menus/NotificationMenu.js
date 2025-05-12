import { useState, useEffect, useTransition, useRef } from 'react'
import { GoBell } from 'react-icons/go'
import { FaEye, FaTrash } from 'react-icons/fa'
import {
	Badge,
	Card,
	CircularProgress,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	Tooltip,
} from '@mui/material'
import {
	GetCustomerNotifications,
	markNotificationAsViewed,
	deleteNotificationForCustomer,
} from '../../service/UserService'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { jwtDecode } from 'jwt-decode'

export default function NotificationIcon({ setGlobalUnreadCount }) {
	const [isPopupOpen, setIsPopupOpen] = useState(false)
	const [notifications, setNotifications] = useState([])
	const [hasUnread, setHasUnread] = useState(false) // Dấu chấm đỏ
	const [selectedNotification, setSelectedNotification] = useState(null)
	const [isDetailOpen, setIsDetailOpen] = useState(false)
	const authHeader = useAuthHeader()
	const authUser = useAuthUser()
	const [isPending, startTransition] = useTransition()
	const username = jwtDecode(authHeader.split(' ')[1]).sub

	// Ref for dropdown menu
	const notificationMenuRef = useRef(null)

	const togglePopup = async () => {
		// Mở/đóng danh sách thông báo
		setIsPopupOpen(!isPopupOpen)

		// Khi mở danh sách thông báo, đánh dấu tất cả là đã xem
		if (!isPopupOpen) {
			try {
				// Lọc ra danh sách thông báo chưa đọc
				const unreadNotifications = notifications.filter((n) => !n.notificatonViewed)

				// Gọi API markNotificationAsViewed với từng thông báo chưa đọc
				await Promise.all(
					unreadNotifications.map((notification) =>
						markNotificationAsViewed(notification.notificationId, authHeader, authUser.username)
					)
				)

				// Tải lại danh sách thông báo sau khi đánh dấu đã xem
				await loadNotifications()
			} catch (error) {
				console.error('Error marking notifications as viewed:', error)
			}
		}
	}

	const loadNotifications = async () => {
		startTransition(async () => {
			try {
				// console.log('Fetching notifications for user:', username)
				const response = await GetCustomerNotifications(authHeader, username, { cache: 'no-cache' })
				// console.log('API Response:', response.data)

				if (response.data) {
					// Phân loại thông báo chưa đọc và đã đọc
					const unreadNotifications = response.data.filter((n) => n.notificatonViewed === false)
					const readNotifications = response.data.filter((n) => n.notificatonViewed === true)

					// Sắp xếp chưa đọc lên đầu
					const sortedNotifications = [...unreadNotifications, ...readNotifications]

					setNotifications(sortedNotifications)

					// Kiểm tra nếu có thông báo chưa đọc
					const hasUnread = unreadNotifications.length > 0
					// console.log('Has Unread Notifications:', hasUnread)
					setHasUnread(hasUnread)
					setGlobalUnreadCount(hasUnread ? unreadNotifications.length : 0) // Cập nhật Navbar
				}
			} catch (error) {
				console.log('Error fetching notifications:', error)
			}
		})
	}

	useEffect(() => {
		loadNotifications()
	}, [])

	// **Handle outside click, but ignore clicks inside the notification dropdown**
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				notificationMenuRef.current &&
				!notificationMenuRef.current.contains(event.target) &&
				!event.target.closest('.MuiDialog-root') // Ignore clicks inside the modal
			) {
				setIsPopupOpen(false) // Close only if clicked outside
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleViewDetails = async (notification, event) => {
		event.stopPropagation() // Prevents event bubbling that would close the dropdown
		setSelectedNotification(notification) // Chọn thông báo
		setIsDetailOpen(true) // Mở modal khi nhấn vào "Xem chi tiết"

		// Nếu thông báo chưa được đánh dấu là đã xem, thì đánh dấu
		if (!notification.notificatonViewed) {
			try {
				await markNotificationAsViewed(notification.notificationId, authHeader, authUser.username)
				await loadNotifications() // Tải lại thông báo để cập nhật trạng thái
			} catch (error) {
				console.error('Error marking notification as viewed:', error)
			}
		}
	}

	const handleDeleteNotification = async (notificationId, event) => {
		event.stopPropagation() // Prevents dropdown from closing
		try {
			await deleteNotificationForCustomer(notificationId, authHeader, authUser.username)
			await loadNotifications()
		} catch (error) {
			console.error('Error deleting notification:', error)
		}
	}

	return (
		<div className='relative'>
			<Tooltip title='Thông báo'>
				<IconButton onClick={togglePopup} className='group'>
					<Badge
						color='error'
						variant='dot'
						invisible={!hasUnread} // Chỉ hiển thị chấm đỏ nếu có thông báo chưa đọc
					>
						<GoBell className='text-3xl text-black transform transition-transform duration-200 ease-in-out group-hover:animate-ring' />
					</Badge>
				</IconButton>
			</Tooltip>

			{isPopupOpen && (
				<div
					ref={notificationMenuRef}
					className='absolute right-0 top-full w-96 bg-white shadow-lg rounded-md z-50'
				>
					<div className='p-4 flex justify-between items-center border-b'>
						<h2 className='text-lg font-semibold'>Notifications</h2>
						<button onClick={togglePopup} className='text-gray-500 hover:text-gray-700'>
							✕
						</button>
					</div>
					<div className='p-4 max-h-[400px] overflow-y-scroll'>
						{isPending ? (
							<div className='flex justify-center items-center'>
								<CircularProgress color='inherit' size={20} />
								<span className='ml-2'>Loading notifications...</span>
							</div>
						) : notifications.length > 0 ? (
							notifications.map((notification, index) => (
								<Card
									key={index}
									className={`notification-item mb-2 p-2 flex justify-between items-center ${
										notification.isNotificationViewed ? 'bg-gray-100' : 'bg-white'
									}`}
								>
									<div className='w-[75%] overflow-hidden'>
										<h1 className='font-poppins font-semibold truncate'>
											{notification.notificationTitle}
										</h1>
										<p className='font-montserrat text-gray-700 truncate'>
											{notification.notificationContent.length > 5
												? notification.notificationContent.slice(0, 5) + '...'
												: notification.notificationContent}
										</p>
										<p className='text-gray-500 text-xs'>
											{notification.createdAt
												? formatDistanceToNow(parseISO(notification.createdAt), { addSuffix: true })
												: 'Invalid Date'}
										</p>
									</div>
									<div className='flex gap-1'>
										<Tooltip title='Xem chi tiết'>
											<IconButton size='small' onClick={(e) => handleViewDetails(notification, e)}>
												<FaEye className='text-blue-500' />
											</IconButton>
										</Tooltip>
										<Tooltip title='Xóa'>
											<IconButton
												size='small'
												color='error'
												onClick={(e) => handleDeleteNotification(notification.notificationId, e)}
											>
												<FaTrash />
											</IconButton>
										</Tooltip>
									</div>
								</Card>
							))
						) : (
							<p className='text-gray-700'>No new notifications</p>
						)}
					</div>
				</div>
			)}

			<Dialog open={isDetailOpen} onClose={() => setIsDetailOpen(false)}>
				<DialogTitle className='text-center font-bold'>
					{selectedNotification?.notificationTitle}
				</DialogTitle>
				<DialogContent className='text-center'>
					<p className='mt-4'>{selectedNotification?.notificationContent || 'Không có nội dung'}</p>
					<p className='text-sm text-gray-500'>
						📤 Sender: <strong>{selectedNotification?.userName || 'Không xác định'}</strong>
					</p>
					<p className='text-sm text-gray-500'>
						⏳ Time:{' '}
						{selectedNotification?.createdAt
							? formatDistanceToNow(parseISO(selectedNotification?.createdAt), { addSuffix: true })
							: 'Không xác định'}
					</p>
				</DialogContent>
			</Dialog>
		</div>
	)
}
