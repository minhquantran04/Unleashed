import React, { useState } from 'react'
import { Card, Typography, Divider, Skeleton, Button } from '@mui/material'
import { formatPrice } from '../../components/format/formats'
import { Link } from 'react-router-dom'
import { confirmOrder, returnOrder } from '../../service/OrderSevice'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { cancelOrder } from '../../service/CheckoutService'
import ClearIcon from '@mui/icons-material/Clear'

// Component hiển thị trạng thái đơn hàng
function OrderStatus({ status }) {
	const statusMap = {
		PENDING: { text: 'Pending', color: 'text-orange-500' },
		PROCESSING: { text: 'Processing', color: 'text-purple-500' },
		COMPLETED: { text: 'Completed', color: 'text-green-500' },
		SHIPPING: { text: 'Shipping', color: 'text-blue-700' },
		CANCELLED: { text: 'Cancelled', color: 'text-red-500' },
		DENIED: { text: 'Denied', color: 'text-red-500' },
		RETURNED: { text: 'Returned', color: 'text-gray-500' },
		RETURNING: { text: 'Returning', color: 'text-yellow-500' },
		INSPECTION: { text: 'Inspection', color: 'text-yellow-500' },
	}

	const { text, color } = statusMap[status] || {
		text: 'Unknown',
		color: 'text-gray-500',
	}

	return (
		<Typography
			variant='subtitle2'
			className={`ml-2 flex font-montserrat justify-end font-semibold ${color}`}
		>
			{text}
		</Typography>
	)
}

// Hàm nhóm sản phẩm trùng nhau và đếm số lượng
const groupOrderDetails = (orderDetails) => {
	const grouped = new Map()

	orderDetails.forEach((item) => {
		const key = `${item.productCode}-${item.color}-${item.size}-${item.productName}`
		grouped.set(key, (grouped.get(key) || 0) + 1)
	})

	return Array.from(grouped.entries()).map(([key, count]) => ({
		key,
		count,
		details: key.split('-'),
	}))
}

function OrderItemCard({ Order, loading }) {
	const [orderStatus, setOrderStatus] = useState(Order.orderStatus)
	const authHeader = useAuthHeader()
	const groupedDetails = groupOrderDetails(Order.orderDetails || [])

	const handleConfirmOrder = async () => {
		try {
			await confirmOrder(Order.orderId, authHeader)
			setOrderStatus('COMPLETED')
		} catch (error) {
			console.error('Error confirming order:', error)
			alert('Failed to confirm order. Please try again.')
		}
	}

	const handleCancelOrder = async () => {
		try {
			await cancelOrder(Order.orderId, authHeader)
			setOrderStatus('CANCELLED')
		} catch (error) {
			console.error('Error cancelling order:', error)
			alert('Failed to cancel order. Please try again.')
		}
	}

	const handleReturnOrder = async () => {
		try {
			await returnOrder(Order.orderId, authHeader)
			setOrderStatus('RETURNING')
		} catch (error) {
			console.error('Error returning order:', error)
			alert('Failed to request return. Please try again.')
		}
	}

	if (loading) {
		return (
			<Card variant='outlined' className='max-w-[800px] font-poppins p-4'>
				<Skeleton variant='rectangular' width='100%' height={150} />
			</Card>
		)
	}

	return (
		<Card variant='outlined' className='max-w-[800px] font-poppins p-4'>
			<div className='flex items-center justify-between'>
				<Typography variant='subtitle1' className='font-semibold font-montserrat'>
					Order: {Order.orderDetails?.[0]?.randomNumber || 'N/A'}
				</Typography>
				<OrderStatus status={orderStatus} />
			</div>

			<Divider className='my-2' />

			<div>
				{groupedDetails.length > 0 ? (
					groupedDetails.map(({ key, count, details }) => (
						<div key={key} className='p-2 border rounded flex justify-between items-center'>
							<div>
								<Typography variant='body2'>
									<strong>Product Name:</strong> {details[3]}
								</Typography>
								<Typography variant='body2'>
									<strong>Color:</strong> {details[1]}
								</Typography>
								<Typography variant='body2'>
									<strong>Size:</strong> {details[2]}
								</Typography>
							</div>
							<Typography variant='h6' className='text-black flex items-center space-x-2'>
								<ClearIcon className='w-5 h-5' /> {/* Tăng kích thước icon */}
								<span className='text-lg '>{count}</span> {/* Tăng kích thước số */}
							</Typography>
						</div>
					))
				) : (
					<Typography variant='body2'>No order details available</Typography>
				)}
			</div>

			<Divider className='my-2' />

			<div className='flex justify-between items-center'>
				<Typography variant='body1' className='font-bold font-montserrat'>
					Total: {formatPrice(Order.totalAmount)}
				</Typography>
				<div className='space-x-3 flex items-center'>
					{/* Cancel Button (PENDING or PROCESSING) */}
					{(orderStatus === 'PENDING' || orderStatus === 'PROCESSING') && (
						<Button
							variant='contained'
							color='error'
							onClick={handleCancelOrder}
							sx={{
								textTransform: 'none',
								fontFamily: 'Montserrat',
								borderRadius: '30px',
							}}
						>
							Cancel Order
						</Button>
					)}

					{/* Confirm Delivery Button (SHIPPING) */}
					{orderStatus === 'SHIPPING' && (
						<Button
							variant='contained'
							color='success'
							onClick={handleConfirmOrder}
							sx={{
								textTransform: 'none',
								fontFamily: 'Montserrat',
								borderRadius: '30px',
							}}
						>
							Confirm Delivery
						</Button>
					)}

					{/* Return Button (SHIPPING or COMPLETED) */}
					{(orderStatus === 'SHIPPING' || orderStatus === 'COMPLETED') && (
						<Button
							variant='contained'
							color='warning'
							onClick={handleReturnOrder}
							sx={{
								textTransform: 'none',
								fontFamily: 'Montserrat',
								borderRadius: '30px',
							}}
						>
							Return Order
						</Button>
					)}

					<Link to={`/user/orders/me/${Order.orderId}`}>
						<Button
							variant='contained'
							color='primary'
							sx={{
								textTransform: 'none',
								fontFamily: 'Montserrat',
								borderRadius: '30px',
							}}
						>
							View Order
						</Button>
					</Link>
				</div>
			</div>
		</Card>
	)
}

export default OrderItemCard
