import React, { useState, useEffect } from 'react'
import { FaEdit, FaEye, FaPlusSquare, FaTrash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../../core/api' // API client setup
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { toast, Zoom } from 'react-toastify'
import { formatPrice } from '../../components/format/formats'
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal'

const DashboardSales = () => {
	const [sales, setSales] = useState([])
	const [saleToDelete, setSaleToDelete] = useState(null)
	const [isOpen, setIsOpen] = useState(false) // Manage modal open state
	const [currentPage, setCurrentPage] = useState(1) // Track current page
	const itemsPerPage = 10 // Set items per page
	const [isLoading, setIsLoading] = useState(true) // Loading state

	const authUser = useAuthUser()
	const userRole = authUser.role
	const varToken = useAuthHeader()

	// Fetch sales data
	const fetchSales = () => {
		setIsLoading(true)
		apiClient
			.get('/api/sales', {
				headers: {
					Authorization: varToken,
				},
			})
			.then((response) => {
				setSales(response.data)
				setIsLoading(false)
			})
			.catch((error) => {
				console.error('Error fetching sales:', error)
				setIsLoading(false)
			})
	}

	// Fetch sales on component mount
	useEffect(() => {
		fetchSales()
	}, [varToken])

	const openDeleteModal = (sale) => {
		setSaleToDelete(sale)
		setIsOpen(true) // Open modal
	}

	const handleClose = () => {
		setIsOpen(false) // Close modal
	}

	const handleDelete = () => {
		if (saleToDelete) {
			apiClient
				.delete(`/api/sales/${saleToDelete.id}`, {
					headers: {
						Authorization: varToken,
					},
				})
				.then((response) => {
					fetchSales() // Reload sales list
					setIsOpen(false)
					toast.success(response.data.message, {
						position: 'bottom-right',
						transition: Zoom,
					})
				})
				.catch((error) =>
					toast.error(error.response?.data?.message || 'Delete failed', {
						position: 'bottom-right',
						transition: Zoom,
					})
				)
		}
	}

	// Get color based on sale status
	function getStatusColor(statusName) {
		switch (statusName) {
			case 'INACTIVE':
				return 'text-gray-500'
			case 'ACTIVE':
				return 'text-green-500'
			case 'EXPIRED':
				return 'text-red-500'
			default:
				return ''
		}
	}

	// Pagination logic
	const paginatedSales = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	const totalPages = Math.ceil(sales.length / itemsPerPage)
	const handlePageChange = (newPage) => setCurrentPage(newPage)

	return (
		<>
			<div className='flex items-center justify-between'>
				<h1 className='text-4xl font-bold mb-6'>Sales List</h1>
				<Link to='/Dashboard/Sales/Create'>
					<button className='text-blue-600 border border-blue-500 px-4 py-2 rounded-lg flex items-center'>
						<FaPlusSquare className='mr-2' /> Create New Sale
					</button>
				</Link>
			</div>

			{isLoading ? (
				<p className='text-center text-gray-500'>Loading sales data...</p>
			) : (
				<div className='overflow-x-auto'>
					<table className='table-auto w-full border-collapse'>
						<thead className='border border-gray-300'>
							<tr>
								<th className='px-4 py-2 text-left'>ID</th>
								<th className='px-4 py-2 text-left'>Sale Type</th>
								<th className='px-4 py-2 text-left'>Sale Value</th>
								<th className='px-4 py-2 text-left'>Start Date</th>
								<th className='px-4 py-2 text-left'>End Date</th>
								<th className='px-4 py-2 text-left'>Status</th>
								<th className='px-4 py-2 text-left'>Action</th>
							</tr>
						</thead>
						<tbody>
							{paginatedSales.length > 0 ? (
								paginatedSales.map((sale) => (
									<tr key={sale.id} className='hover:bg-gray-50'>
										<td className='px-4 py-2'>{sale.id}</td>
										<td className='px-4 py-2'>{sale.saleType?.saleTypeName || 'N/A'}</td>
										<td className='px-4 py-2'>
											{sale.saleType?.saleTypeName === 'PERCENTAGE'
												? sale.saleValue + '%'
												: formatPrice(sale.saleValue)}
										</td>
										<td className='px-4 py-2'>
											{new Date(sale.saleStartDate).toLocaleDateString()}
										</td>
										<td className='px-4 py-2'>{new Date(sale.saleEndDate).toLocaleDateString()}</td>
										<td
											className={`px-4 py-2 font-bold ${getStatusColor(
												sale.saleStatus?.saleStatusName
											)}`}
										>
											{sale.saleStatus?.saleStatusName || 'N/A'}
										</td>
										<td className='px-4 py-2 flex space-x-2 items-center'>
											<Link to={`/Dashboard/Sales/${sale.id}`}>
												<FaEye className='text-green-500 cursor-pointer' />
											</Link>
											<Link to={`/Dashboard/Sales/Edit/${sale.id}`}>
												<FaEdit className='text-blue-500 cursor-pointer' />
											</Link>
											<Link to={`/Dashboard/Sales/${sale.id}/AddProduct`}>
												<FaPlusSquare
													className='text-blue-500 cursor-pointer'
													title='Add Product to Sale'
												/>
											</Link>
											{userRole === 'ADMIN' && (
												<button
													className='text-red-500 cursor-pointer'
													onClick={() => openDeleteModal(sale)}
												>
													<FaTrash />
												</button>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan='7' className='text-center text-red-500 py-4'>
										No sales found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Pagination */}
			<div className='flex justify-center mt-4'>
				<button
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
					className='px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50'
				>
					Previous
				</button>
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index}
						onClick={() => handlePageChange(index + 1)}
						className={`px-4 py-2 mx-1 border border-gray-300 rounded-lg ${
							currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
						}`}
					>
						{index + 1}
					</button>
				))}
				<button
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
					className='px-4 py-2 mx-1 border border-gray-300 rounded-lg disabled:opacity-50'
				>
					Next
				</button>
			</div>

			<DeleteConfirmationModal
				isOpen={isOpen}
				onClose={handleClose}
				onConfirm={handleDelete}
				name={saleToDelete?.id || ''}
			/>
		</>
	)
}

export default DashboardSales
