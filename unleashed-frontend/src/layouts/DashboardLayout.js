import React, { useState } from 'react'
import { FaBars, FaCog, FaSignOutAlt, FaTimes, FaInfoCircle } from 'react-icons/fa'
import Sidebar from '../components/sidebars/Sidebar'
import Breadcrumb from '../components/breadcrumb/Breadcrumbs'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import userDefault from '../assets/images/userdefault.webp'
import { Link } from 'react-router-dom'
import ManagerSettings from '../pages/User/ManagerSettings'
import { ArrowBack, ArrowCircleRight, ArrowForward } from '@mui/icons-material'

const DashboardLayout = ({ toggleSidebar, isOpen, children }) => {
	const authUser = useAuthUser()

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
	const [userImage, setUserImage] = useState(
		localStorage.getItem('userImage') || authUser.userImage || userDefault
	)
	const [fullName, setFullName] = useState(
		localStorage.getItem('userFullName') || authUser.userFullName
	)

	const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)
	const openSettingsModal = () => {
		setIsSettingsModalOpen(true)
		setIsDropdownOpen(false) // Close dropdown when opening modal
	}
	const closeSettingsModal = () => setIsSettingsModalOpen(false)

	return (
		<div className='flex h-screen'>
			{/* Sidebar */}
			<Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

			{/* Main content area */}
			<div className='flex-1 flex flex-col'>
				{/* Header */}
				<header className='flex justify-between items-center p-6 bg-white shadow'>
					<div className='flex items-center px-10'>
						{/* Hamburger menu */}
						<button onClick={toggleSidebar} className='text-gray-500'>
							{isOpen ? <ArrowBack /> : <ArrowForward />}
						</button>
					</div>

					{/* User Profile */}
					<div className='relative flex items-center space-x-2'>
						<span
							className={`font-medium px-2 py-1 rounded ${
								authUser.role === 'STAFF'
									? 'text-yellow-700 bg-yellow-100'
									: authUser.role === 'ADMIN'
									? 'text-red-700 bg-red-100'
									: 'text-gray-700 bg-gray-100'
							}`}
						>
							{authUser.role}
						</span>
						<div
							className='flex items-center space-x-2 object-cover cursor-pointer transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-md'
							onClick={toggleDropdown}
						>
							<img src={userImage} alt='User' className='w-8 h-8 rounded-full object-cover' />

							<span className='font-medium'>{fullName}</span>
						</div>
					</div>
					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div className='absolute right-0 top-12 mt-2 w-48 bg-white border rounded-md shadow-lg z-10'>
							{/* Conditionally render Settings or View Info based on role */}
							<button
								className='px-4 py-2 w-full cursor-pointer hover:bg-gray-100 flex items-center gap-1'
								onClick={openSettingsModal}
							>
								{authUser.role === 'STAFF' ? <FaInfoCircle /> : <FaCog />}
								{authUser.role === 'STAFF' ? 'View Info' : 'Settings'}
							</button>

							{/* Log Out Button */}
							<Link to='/Dashboard/Logout' className='w-full'>
								<button className='px-4 py-2 w-full cursor-pointer hover:bg-gray-100 flex items-center gap-1 text-gray-700'>
									<FaSignOutAlt /> Log Out
								</button>
							</Link>
						</div>
					)}
				</header>

				{/* Settings Modal */}
				<ManagerSettings
					open={isSettingsModalOpen}
					onClose={closeSettingsModal}
					onImageUpdate={(newImage) => setUserImage(newImage)}
					onFullNameUpdate={(newFullName) => setFullName(newFullName)}
				/>

				{/* Breadcrumb */}
				<div className='p-4'>
					<Breadcrumb />
				</div>

				{/* Main content */}
				<main className='flex-1 p-6 overflow-auto m-5'>{children}</main>
			</div>
		</div>
	)
}

export default DashboardLayout
