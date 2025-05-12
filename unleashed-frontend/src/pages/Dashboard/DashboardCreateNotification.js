import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	Button,
	TextField,
	Typography,
	Checkbox,
	FormControlLabel,
	Autocomplete,
	TextField as MuiTextField,
} from '@mui/material'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { apiClient } from '../../core/api'
import { toast, Zoom } from 'react-toastify'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { InputAdornment } from '@mui/material'
const DashboardCreateNotification = () => {
	const [title, setTitle] = useState('')
	const [message, setMessage] = useState('')
	const [userNames, setUserNames] = useState([])
	const [sendToAllUsers, setSendToAllUsers] = useState(false)
	const [sendToAllStaff, setSendToAllStaff] = useState(false)
	const [touched, setTouched] = useState({
		title: false,
		message: false,
	})

	const [users, setUsers] = useState([])
	const authUser = useAuthUser()
	const navigate = useNavigate()
	const varToken = useAuthHeader()
	const [currentPage, setPage] = useState(0)
	const [pageSize, setSize] = useState(10)
	const [searchTerm, setSearchTerm] = useState('')

	useEffect(() => {
		fetchUsers(currentPage, pageSize, searchTerm)
	}, [currentPage, pageSize, searchTerm])

	const fetchUsers = (page, size, search = '') => {
		apiClient
			.get(`/api/admin?page=${page}&size=${size}&search=${search}`, {
				headers: {
					Authorization: varToken,
				},
			})
			.then((response) => {
				setUsers(response.data.content || [])
			})
			.catch((error) => {
				console.error('Error fetching users:', error)
			})
	}

	const handleUserSelection = (roleName, checked) => {
		if (checked) {
			const selectedUsers = users
				.filter((user) => user.role.roleName === roleName)
				.map((user) => user.userUsername)
			setUserNames((prev) => [...new Set([...prev, ...selectedUsers])])
		} else {
			setUserNames((prev) =>
				prev.filter(
					(username) =>
						!users.some((user) => user.userUsername === username && user.role.roleName === roleName)
				)
			)
		}
	}

	const isTitleValid = title.trim().length > 5
	const isMessageValid = message.trim().length > 5

	const handleSubmit = async (e) => {
		e.preventDefault()
		setTouched({ title: true, message: true })

		if (!isTitleValid || !isMessageValid) return

		const payload = {
			notificationTitle: title,
			notificationContent: message.trim(),
			userName: authUser?.username,
			userNames: userNames,
		}

		try {
			await apiClient.post('/api/notifications', payload, {
				headers: { Authorization: varToken },
			})
			toast.success('Notification created successfully!', {
				position: 'bottom-right',
				transition: Zoom,
			})
			navigate('/Dashboard/Notifications')
		} catch (error) {
			toast.error('Failed to create notification', { position: 'bottom-right', transition: Zoom })
		}
	}

	return (
		<div className='container mx-auto p-4 flex flex-col h-screen'>
			<Typography variant='h4' gutterBottom>
				Create Notification
			</Typography>
			<form onSubmit={handleSubmit} className='flex flex-col flex-grow'>
				<div className='flex-grow mb-4'>
					<TextField
						label='Title'
						variant='outlined'
						fullWidth
						margin='normal'
						value={title}
						onChange={(e) => {
							if (e.target.value.length <= 30) {
								setTitle(e.target.value)
							}
						}}
						onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
						error={touched.title && !isTitleValid}
						helperText={
							touched.title && !isTitleValid ? 'Title must be longer than 5 characters.' : ''
						}
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position='end' style={{ fontSize: '12px', color: 'gray' }}>
									{title.length}/30
								</InputAdornment>
							),
						}}
					/>
					<TextField
						label='Message'
						variant='outlined'
						fullWidth
						margin='normal'
						multiline
						rows={4}
						value={message}
						onChange={(e) => {
							if (e.target.value.length <= 300) {
								setMessage(e.target.value)
							}
						}}
						onBlur={() => setTouched((prev) => ({ ...prev, message: true }))}
						error={touched.message && !isMessageValid}
						helperText={
							touched.message && !isMessageValid ? 'Message must be longer than 5 characters.' : ''
						}
						required
						InputProps={{
							endAdornment: (
								<InputAdornment position='end' style={{ fontSize: '12px', color: 'gray' }}>
									{message.length}/300
								</InputAdornment>
							),
						}}
					/>
					{!sendToAllUsers && !sendToAllStaff && (
						<Autocomplete
							multiple
							options={users
								.filter((user) => user.role.roleName === 'CUSTOMER')
								.map((user) => user.userUsername)}
							renderInput={(params) => (
								<MuiTextField {...params} label='Select Users' variant='outlined' margin='normal' />
							)}
							onChange={(event, newValue) => setUserNames(newValue)}
							value={userNames}
						/>
					)}

					<FormControlLabel
						control={
							<Checkbox
								checked={sendToAllUsers}
								onChange={(e) => {
									setSendToAllUsers(e.target.checked)
									handleUserSelection('CUSTOMER', e.target.checked)
								}}
							/>
						}
						label='Select All Users'
					/>
					<Button type='submit' variant='contained' color='primary' className='mt-auto'>
						Create Notification
					</Button>
				</div>
			</form>
		</div>
	)
}

export default DashboardCreateNotification
