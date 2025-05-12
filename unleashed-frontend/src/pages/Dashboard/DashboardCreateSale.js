import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import {
	Button,
	TextField,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Box,
} from '@mui/material'
import { apiClient } from '../../core/api'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { toast, Zoom } from 'react-toastify'

const DashboardCreateSale = () => {
	const navigate = useNavigate()
	const varToken = useAuthHeader()
	const today = new Date()
	const addOffset = (dateString) => {
		// Giả sử múi giờ của bạn là +07:00
		return dateString + ':00+07:00'
	}
	// Dữ liệu tĩnh (theo như bảng của bạn)
	const saleTypes = [
		{ id: 1, saleTypeName: 'PERCENTAGE' },
		{ id: 2, saleTypeName: 'FIXED AMOUNT' },
	]

	// Mỗi object có cả id và saleStatusName
	const saleStatuses = [
		{ id: 1, saleStatusName: 'INACTIVE' },
		{ id: 2, saleStatusName: 'ACTIVE' },
	]

	// Kiểm tra nếu token tồn tại, sau đó giải mã để lấy role
	let isStaff = false
	if (varToken) {
		try {
			const decodedToken = jwtDecode(varToken.replace('Bearer ', ''))
			isStaff = decodedToken.role[0].authority === 'STAFF' // Nếu role là STAFF thì isStaff = true
			console.log('Decoded Token:', decodedToken)
		} catch (error) {
			console.error('Error decoding token:', error)
		}
	}

	// Validation schema với Formik & Yup
	const validationSchema = Yup.object({
		saleType: Yup.number().required('Sale type is required'),
		saleValue: Yup.number()
			.required('Sale value is required')
			.min(0, 'Sale value cannot be negative')
			.max(99999999, 'Sale value cannot exceed 99999999')
			.test(
				'max-percentage',
				'Sale value cannot be greater than 100 for percentage',
				function (value) {
					const { saleType } = this.parent
					// Nếu saleType = 1 (PERCENTAGE) thì không vượt quá 100
					if (saleType === 1 && value > 100) {
						return false
					}
					return true
				}
			),
		startDate: Yup.date().required('Start date is required'),
		endDate: Yup.date()
			.required('End date is required')
			.min(Yup.ref('startDate'), 'End date must be after start date'),
		saleStatus: Yup.number().required('Sale status is required'),
	})

	const handleSubmit = (values) => {
		const selectedStatus = saleStatuses.find((s) => s.id === values.saleStatus)
		const finalSaleStatus = isStaff
			? saleStatuses.find((s) => s.saleStatusName === 'INACTIVE')
			: selectedStatus

		const payload = {
			saleType: { id: values.saleType },
			saleValue: values.saleValue,
			saleStartDate: addOffset(values.startDate),
			saleEndDate: addOffset(values.endDate),
			saleStatus: {
				id: finalSaleStatus.id,
				saleStatusName: finalSaleStatus.saleStatusName,
			},
		}

		const startDateTimestamp = new Date(values.startDate).getTime()
		const todayTimestamp = today.getTime()

		// Kiểm tra logic saleStatus
		if (values.saleStatus === 2) {
			// Sale đang ACTIVE
			if (startDateTimestamp > todayTimestamp) {
				toast.error('Cannot set an Active sale to start in the future!', {
					position: 'bottom-right',
					transition: Zoom,
				})
				return
			}
		}

		console.log('Submitting payload:', payload)
		apiClient
			.post('/api/sales', payload, {
				headers: { Authorization: varToken },
			})
			.then((response) => {
				toast.success('Create sale successfully', {
					position: 'bottom-right',
					transition: Zoom,
				})
				console.log('Sale created successfully:', response.data)
				navigate('/Dashboard/Sales')
			})
			.catch((error) => {
				toast.error('Create sale failed', {
					position: 'bottom-right',
					transition: Zoom,
				})
				console.error('Error creating sale:', error)
			})
	}

	return (
		<Box className='max-w-lg mx-auto' p={2}>
			<Typography variant='h4' gutterBottom>
				Create New Sale
			</Typography>

			<Formik
				initialValues={{
					saleType: 1,
					saleValue: '',
					startDate: '',
					endDate: '',
					saleStatus: isStaff ? saleStatuses.find((s) => s.saleStatusName === 'INACTIVE').id : '',
				}}
				validationSchema={validationSchema}
				onSubmit={handleSubmit}
			>
				{({ errors, touched, values, setFieldValue, handleBlur, handleChange }) => (
					<Form className='space-y-6'>
						{/* Sale Type */}
						<FormControl
							fullWidth
							margin='normal'
							error={Boolean(errors.saleType && touched.saleType)}
						>
							<InputLabel>Sale Type</InputLabel>
							<Select
								name='saleType'
								label='Sale Type'
								value={values.saleType}
								onChange={(e) => setFieldValue('saleType', Number(e.target.value))}
								onBlur={handleBlur}
							>
								{saleTypes.map((type) => (
									<MenuItem key={type.id} value={type.id}>
										{type.saleTypeName}
									</MenuItem>
								))}
							</Select>
							{errors.saleType && touched.saleType && (
								<Typography color='error' variant='caption'>
									{errors.saleType}
								</Typography>
							)}
						</FormControl>

						{/* Sale Value */}
						<TextField
							name='saleValue'
							label='Sale Value'
							type='number'
							fullWidth
							margin='normal'
							value={values.saleValue}
							onChange={(e) => {
								const value = e.target.value
								if (value === '' || Number(value) > 0) {
									handleChange(e)
								} else {
									errors.saleValue = 'Sale value must greater than 0 '
								}
							}}
							onBlur={handleBlur}
							error={Boolean(errors.saleValue && touched.saleValue)}
							helperText={touched.saleValue && errors.saleValue}
						/>

						{/* Start Date (datetime-local) */}
						<TextField
							name='startDate'
							label='Start Date'
							type='datetime-local'
							fullWidth
							margin='normal'
							InputLabelProps={{ shrink: true }}
							value={values.startDate}
							onChange={(e) => {
								setFieldValue('startDate', e.target.value)
							}}
							onBlur={handleBlur}
							error={Boolean(errors.startDate && touched.startDate)}
							helperText={touched.startDate && errors.startDate}
						/>

						{/* End Date (datetime-local) */}
						<TextField
							name='endDate'
							label='End Date'
							type='datetime-local'
							fullWidth
							margin='normal'
							InputLabelProps={{ shrink: true }}
							value={values.endDate}
							onChange={(e) => {
								setFieldValue('endDate', e.target.value)
							}}
							onBlur={handleBlur}
							error={Boolean(errors.endDate && touched.endDate)}
							helperText={touched.endDate && errors.endDate}
						/>

						{/* Sale Status */}
						<FormControl fullWidth margin='normal'>
							<InputLabel>Sale Status</InputLabel>
							<Select
								name='saleStatus'
								label='Sale Status'
								value={values.saleStatus}
								onChange={(e) => setFieldValue('saleStatus', Number(e.target.value))}
								onBlur={handleBlur}
								disabled={isStaff}
							>
								{saleStatuses.map((status) => (
									<MenuItem key={status.id} value={status.id}>
										{status.saleStatusName}
									</MenuItem>
								))}
							</Select>
							{errors.saleStatus && touched.saleStatus && (
								<Typography color='error' variant='caption'>
									{errors.saleStatus}
								</Typography>
							)}
						</FormControl>

						{/* Submit Button */}
						<Button type='submit' variant='contained' color='primary' fullWidth>
							Create Sale
						</Button>
					</Form>
				)}
			</Formik>
		</Box>
	)
}

export default DashboardCreateSale
