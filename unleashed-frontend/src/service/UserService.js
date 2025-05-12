import { jwtDecode } from 'jwt-decode'
import { apiClient } from '../core/api'
import { toast, Zoom } from 'react-toastify'
import axios from 'axios'
export const GetUserInfo = (authHeader) => {
	try {
		const response = apiClient.get('/api/account/me', {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		if (error.message) {
			toast.error(error.message, {
				position: 'bottom-center',
				transition: Zoom,
			})
		}
	}
}
export const GetCustomerNotifications = async (authHeader, username) => {
	return apiClient.get(`/api/notifications/customer/${username}`, {
		headers: { Authorization: authHeader },
	})
}
export const GetActiveCustomerNotifications = async (authHeader, username) => {
	return apiClient.get(`/api/notifications/customer/${username}`, {
		headers: { Authorization: authHeader },
	})
}
export const markNotificationAsViewed = async (notificationId, authHeader, username) => {
	return apiClient.put(`/api/notifications/customer/view/${notificationId}`, null, {
		headers: { Authorization: authHeader },
		params: { username },
	})
}

export const deleteNotificationForCustomer = async (notificationId, authHeader, username) => {
	return apiClient.put(`/api/notifications/customer/delete/${notificationId}`, null, {
		headers: { Authorization: authHeader },
		params: { username },
	})
}

export const getMyReviews = async (authHeader, username) => {
	const response = await apiClient.get(`/api/reviews/user/${username}`, {
		headers: {
			Authorization: authHeader,
		},
	})
	return response
}

export const UpdateUserInfo = async (data, authHeader, signIn) => {
	try {
		console.log(' Data before send API:', data)

		const response = await apiClient.put(
			'/api/account',
			{
				userId: data.userId,
				username: data.username,
				userImage: data.userImage,
				fullName: data.fullName,
				userAddress: data.userAddress,
				userPhone: data.userPhone,
			},
			{
				headers: {
					Authorization: authHeader,
				},
			}
		)

		return response
	} catch (error) {
		console.error('Error in UpdateUserInfo:', error)
	}
}

export const RequestDeleteAccount = (authHeader) => {
	apiClient
		.post(
			'/api/account/request-delete',
			{},
			{
				headers: {
					Authorization: authHeader,
				},
			}
		)
		.then((response) => {
			return response
		})
		.catch((error) => {
			console.log(error?.data)
			toast.error(error?.data?.message || 'Error request delete account', {
				position: 'top-center',
				transition: Zoom,
			})
		})
}
export const ChangePassword = async (data, authHeader) => {
	console.log('📩 Gửi request đổi mật khẩu với:', data)

	try {
		const response = await apiClient.put(
			'/api/user/update-password',
			{
				userEmail: data.userEmail, // 🔥 Chuyển `userId` → `userEmail`
				newPassword: data.newPassword,
				oldPassword: data.oldPassword,
			},
			{
				headers: {
					Authorization: authHeader,
				},
			}
		)

		return response
	} catch (error) {
		console.error('❌ ChangePassword Error:', error)
	}
}

export const GetNotifications = async (authHeader) => {
	try {
		const response = apiClient.get('/api/notifications/as', {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error?.data)
	}
}

export const getMyorders = async (authHeader, page) => {
	try {
		const response = await apiClient.get('/api/orders/my-orders?page=' + page + '&size=6', {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}

export const getMyDiscount = async (authHeader) => {
	try {
		const response = await apiClient.get('/api/discounts/me', {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}

export const fetchUserCart = async (authHeader) => {
	try {
		const response = await apiClient.get('/api/cart', {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}

export const addToCart = async (authHeader, variationId, quantity) => {
	try {
		const response = await apiClient.post(`/api/cart/${variationId}`, quantity, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.error('Error adding to cart:', error)
		if (error.response) {
			console.log(error.response.data)
		}
	}
}

export const removeFromCart = async (authHeader, variationId) => {
	try {
		const response = await apiClient.delete(`/api/cart/${variationId}`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}
export const removeAllFromCart = async (authHeader) => {
	try {
		const response = await apiClient.delete(`/api/cart/All`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}

export const registerMembership = async (authHeader, username) => {
	try {
		const response = await apiClient.get(`/api/ranks/register/${username}`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}

export const unregisterMembership = async (authHeader, username) => {
	try {
		const response = await apiClient.delete(`/api/ranks/unregister/${username}`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error)
	}
}
export const fetchAllMembership = async (authHeader) => {
	try {
		const response = await apiClient.get(`/api/ranks`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}
export const fetchMembership = async (authHeader, username) => {
	try {
		const response = await apiClient.get(`/api/ranks/${username}`, {
			headers: {
				Authorization: authHeader,
			},
		})
		return response
	} catch (error) {
		console.log(error.data)
	}
}
