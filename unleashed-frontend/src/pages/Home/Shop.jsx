import React, { useState, useRef } from 'react'
import ProductList from '../../components/lists/ProductList'
import MainLayout from '../../layouts/MainLayout'
import bg from '../../assets/images/bg.svg'
import { Link } from 'react-router-dom'
import FilterComponent from '../../components/filters/MultipleFilter'
import { Pagination } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import { useProduct } from '../../components/Providers/Product'

const itemsPerPage = 12

export function Shop() {
	const [page, setPage] = useState(1)
	const { products: productData, loading, error } = useProduct()

	const productListRef = useRef(null)
	const countProductRef = useRef(null)
	const [filter, setFilter] = useState({
		brand: '',
		category: '',
		priceOrder: '',
		rating: 0,
	})

	const handleFilterChange = (data) => {
		setFilter(data)
		setPage(1)
	}

	const applyFilters = () => {
		if (!productData) {
			return []
		}

		let filteredProducts = [...productData]

		// Filter by Category (already implemented)
		if (filter.category) {
			filteredProducts = filteredProducts.filter((product) =>
				product.categoryList.some((cat) => cat.categoryName === filter.category)
			)
		}

		// Filter by Brand (already implemented)
		if (filter.brand) {
			filteredProducts = filteredProducts.filter((product) => product.brandName === filter.brand)
		}

		// Price Order (Low to High, High to Low) (already implemented)
		if (filter.priceOrder === 'asc') {
			filteredProducts.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0))
		} else if (filter.priceOrder === 'desc') {
			filteredProducts.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0))
		}

		// Rating Filter (NEW IMPLEMENTATION)
		if (filter.rating > 0) {
			// Filter only if rating > 0 (not default 0)
			filteredProducts = filteredProducts.filter(
				(product) => product.averageRating === filter.rating
			)
		}

		return filteredProducts
	}

	const filteredProducts = applyFilters()
	const startIndex = (page - 1) * itemsPerPage
	const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage)
	const pageCount = Math.ceil(filteredProducts.length / itemsPerPage)
	const handlePageChange = (event, value) => {
		setPage(value) // Updated handlePageChange function
	}
	const countProduct = productData ? productData.length : 0 // Handle null productData

	if (loading) {
		return (
			<MainLayout>
				<div>Loading products...</div>
			</MainLayout>
		)
	}

	if (error) {
		return (
			<MainLayout>
				<div>Error loading products: {error}</div>
			</MainLayout>
		)
	}

	return (
		<MainLayout>
			<div className='Shop pb-10'>
				<div className='headerPage relative text-center'>
					<img className='w-screen h-40 object-cover' src={bg} alt='Background' />
					<div className='headerName w-full absolute top-0 left-0 flex flex-col items-center justify-center h-full'>
						<h1 className='font-poppins font-semibold text-2xl text-black'>Shop</h1>
						<div className='breadcrumbs mt-4'>
							<Breadcrumbs aria-label='breadcrumb' className='text-black'>
								<Link to='/' className='font-semibold font-poppins text-black hover:text-blue-600'>
									Home
								</Link>
								<Typography color='textPrimary' className='font-poppins'>
									Shop
								</Typography>
							</Breadcrumbs>
						</div>
					</div>
				</div>
				<div className='bg-beluBlue h-28'></div>
				<div className='numberProducts pl-16 pt-10' ref={countProductRef}>
					<p className='font-montserrat font-semibold text-3xl'>New({countProduct})</p>
				</div>
				<div className='grid grid-cols-12 gap-4 pt-10'>
					<div className='col-span-4 px-12'>
						<FilterComponent onFilter={handleFilterChange} />
					</div>
					<div className='col-span-8'>
						{filteredProducts.length > 0 ? (
							<div className='col-span-1 flex flex-col items-center' ref={productListRef}>
								<ProductList products={currentItems} />
								<div className='paginate mt-6'>
									<Pagination
										count={pageCount}
										page={page}
										onChange={handlePageChange}
										color='primary'
										shape='rounded'
										showFirstButton
										showLastButton
									/>
								</div>
							</div>
						) : (
							<div className='errorLoading text-center'>
								<p className='font-poppins font-bold text-3xl'>No products available</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainLayout>
	)
}

export default Shop
