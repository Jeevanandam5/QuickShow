import React from 'react'
import AdminNavbar from '../../component/admin/AdminNavbar'
import AdminSidebar from '../../component/admin/AdminSidebar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <AdminNavbar />
            <div className='flex'>
                <AdminSidebar />
                <div className='flex flex-col px-5 py-10 h-[calc(100vh-80px)] overflow-y-auto w-full'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Layout