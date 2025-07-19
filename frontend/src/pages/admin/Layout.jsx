import React, { useEffect } from 'react'
import AdminNavbar from '../../component/admin/AdminNavbar'
import AdminSidebar from '../../component/admin/AdminSidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import Loading from '../../component/Loading'

const Layout = () => {

    const {isAdmin , fetchIsAdmin} = useAppContext()
    const navigate = useNavigate()

    useEffect(()=>{
        fetchIsAdmin()
    },[])

    return isAdmin ?(
        <>
            <AdminNavbar />
            <div className='flex'>
                <AdminSidebar />
                <div className='flex flex-col px-5 py-10 h-[calc(100vh-80px)] overflow-y-auto w-full'>
                    <Outlet />
                </div>
            </div>
        </>
    ) : (
    <Loading/>
)
}

export default Layout