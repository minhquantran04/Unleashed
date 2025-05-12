import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	Button,
	TextField,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormHelperText,
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { apiClient } from '../../core/api'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { toast, Zoom } from 'react-toastify'

const today = new Date()

// Định nghĩa mảng hằng số cho saleTypes và saleStatuses theo API
const saleTypes = [
	{ id: 1, saleTypeName: 'PERCENTAGE' },
	{ id: 2, saleTypeName: 'FIXED AMOUNT' },
]

const saleStatuses = [
	{ id: 1, saleStatusName: 'INACTIVE' },
	{ id: 2, saleStatusName: 'ACTIVE' },
	{ id: 3, saleStatusName: 'EXPIRED' },
]

const convertToOffsetDateTime = (value) => {
	if (!value) return ''
	if (value.length === 16) {
		return value + ':00Z'
	}
	return value
}

// Validation schema (vẫn dùng string cho saleType và saleStatus)
const validationSchema = Yup.object({
	saleType: Yup.string()
		.required('Sale type is required')
		.oneOf(['PERCENTAGE', 'FIXED AMOUNT'], 'Invalid sale type'),
	saleValue: Yup.number()
		.required('Sale value is required')
		.min(0, 'Sale value cannot be negative')
		.when('saleType', {
			is: 'PERCENTAGE',
			then: (schema) => schema.max(100, 'Sale value cannot be greater than 100 for percentage'),
		})
		.max(999999999999, 'Sale value cannot exceed 999999999999'),
	saleStatus: Yup.string()
		.required('Sale status is required')
		.oneOf(['ACTIVE', 'INACTIVE', 'EXPIRED'], 'Invalid sale status'),
	startDate: Yup.date().required('Start date is required'),
	endDate: Yup.date()
		.required('End date is required')
		.min(Yup.ref('startDate'), 'End date must be after start date'),
})

const DashboardEditSale = () => {
	const [initialValues, setInitialValues] = useState({
		saleType: '', // sẽ lưu là string (saleTypeName)
		saleValue: '',
		startDate: '',
		endDate: '',
		saleStatus: '', // sẽ lưu là string (saleStatusName)
	})

	const navigate = useNavigate()
	const { saleId } = useParams()
	const varToken = useAuthHeader()

	// Hàm chuyển đổi chuỗi ngày từ API sang định dạng "YYYY-MM-DDTHH:mm"
	const formatDateTime = (dateString) => {
		if (!dateString) return ''
		const date = new Date(dateString)
		// Lấy đến phút (ví dụ: "2025-02-25T04:04")
		return date.toISOString().slice(0, 16)
	}

	// Lấy dữ liệu sale từ API
	useEffect(() => {
		apiClient
			.get(`/api/sales/${saleId}`, {
				headers: {
					Authorization: varToken,
				},
			})
			.then((response) => {
				const sale = response.data
				console.log('Sale detail:', sale)
				setInitialValues({
					// Lấy tên từ object saleType và saleStatus
					saleType: sale.saleType.saleTypeName,
					saleValue: sale.saleValue,
					startDate: formatDateTime(sale.saleStartDate),
					endDate: formatDateTime(sale.saleEndDate),
					saleStatus: sale.saleStatus.saleStatusName,
				})
			})
			.catch((error) => {
				console.error('Error fetching sale details:', error)
			})
	}, [saleId, varToken])

	// Khởi tạo formik
	const formik = useFormik({
		initialValues,
		enableReinitialize: true, // Cập nhật lại form khi initialValues thay đổi
		validationSchema,
		onSubmit: (values) => {
			// Tìm đối tượng saleType và saleStatus dựa trên tên
			const selectedSaleType = saleTypes.find((t) => t.saleTypeName === values.saleType)
			const selectedSaleStatus = saleStatuses.find((s) => s.saleStatusName === values.saleStatus)

			// Gói payload theo API
			const payload = {
				saleType: selectedSaleType,
				saleValue: values.saleValue,
				saleStartDate: convertToOffsetDateTime(values.startDate),
				saleEndDate: convertToOffsetDateTime(values.endDate),
				saleStatus: selectedSaleStatus,
			}

			const startDateTimestamp = new Date(values.startDate).getTime()
			const todayTimestamp = today.getTime()

			// Kiểm tra logic saleStatus
			if (selectedSaleStatus?.id === 2) {
				// Sale đang ACTIVE
				if (startDateTimestamp > todayTimestamp) {
					formik.setFieldError('startDate', 'Start date cannot be in the future for ACTIVE sales')
					toast.error('Cannot set an Active sale to start in the future!', {
						position: 'bottom-right',
						transition: Zoom,
					})
					return
				}
			}

			apiClient
				.put(`/api/sales/${saleId}`, payload, {
					headers: {
						Authorization: varToken,
					},
				})
				.then((response) => {
					toast.success('Update sale successfully', {
						position: 'bottom-right',
						transition: Zoom,
					})
					console.log('Sale updated successfully:', response.data)
					navigate('/Dashboard/Sales')
				})
				.catch((error) => {
					toast.error('Update sale failed', {
						position: 'bottom-right',
						transition: Zoom,
					})
					console.error('Error updating sale:', error)
				})
		},
	})

	return (
		<div className='max-w-lg mx-auto'>
			<Typography variant='h4' gutterBottom>
				Edit Sale {saleId}
			</Typography>
			<form onSubmit={formik.handleSubmit} className='space-y-6'>
				{/* Sale Type */}
				<FormControl fullWidth margin='normal'>
					<InputLabel>Sale Type</InputLabel>
					<Select
						id='saleType'
						name='saleType'
						value={formik.values.saleType}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						label='Sale Type'
						disabled
						required
					>
						<MenuItem value='PERCENTAGE'>Percentage</MenuItem>
						<MenuItem value='FIXED AMOUNT'>FIXED AMOUNT</MenuItem>
					</Select>
					{formik.touched.saleType && formik.errors.saleType && (
						<Typography color='error'>{formik.errors.saleType}</Typography>
					)}
				</FormControl>

				{/* Sale Value */}
				<TextField
					label='Sale Value'
					type='number'
					id='saleValue'
					name='saleValue'
					value={formik.values.saleValue}
					onChange={(e) => {
						const value = Number(e.target.value)
						formik.setFieldValue('saleValue', value > 0 ? value : '')
					}}
					onBlur={formik.handleBlur}
					fullWidth
					margin='normal'
					required
					error={formik.touched.saleValue && Boolean(formik.errors.saleValue)}
					helperText={formik.touched.saleValue && formik.errors.saleValue}
				/>

				{/* Start Date */}
				<TextField
					label='Start Date'
					type='datetime-local'
					id='startDate'
					name='startDate'
					value={formik.values.startDate}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					fullWidth
					margin='normal'
					InputLabelProps={{
						shrink: true,
					}}
					required
					error={formik.touched.startDate && Boolean(formik.errors.startDate)}
					helperText={formik.touched.startDate && formik.errors.startDate}
				/>

				{/* End Date */}
				<TextField
					label='End Date'
					type='datetime-local'
					id='endDate'
					name='endDate'
					value={formik.values.endDate}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					fullWidth
					margin='normal'
					InputLabelProps={{
						shrink: true,
					}}
					required
					error={formik.touched.endDate && Boolean(formik.errors.endDate)}
					helperText={formik.touched.endDate && formik.errors.endDate}
				/>

				{/* Sale Status */}
				<FormControl
					fullWidth
					margin='normal'
					error={formik.touched.saleStatus && Boolean(formik.errors.saleStatus)}
				>
					<InputLabel>Sale Status</InputLabel>
					<Select
						id='saleStatus'
						name='saleStatus'
						value={formik.values.saleStatus}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						label='Sale Status'
						required
					>
						<MenuItem value='ACTIVE'>Active</MenuItem>
						<MenuItem value='INACTIVE'>Inactive</MenuItem>
						{formik.values.endDate && new Date(formik.values.endDate) < today && (
							<MenuItem value='EXPIRED'>EXPIRED</MenuItem>
						)}
					</Select>
					<FormHelperText>{formik.touched.saleStatus && formik.errors.saleStatus}</FormHelperText>
				</FormControl>

				{/* Submit Button */}
				<Button type='submit' variant='contained' color='primary' fullWidth>
					Update Sale
				</Button>
			</form>
		</div>
	)
}

export default DashboardEditSale
