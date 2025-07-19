import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../component/Loading'
import Title from '../../component/admin/Title'
import { dateFormate } from '../../slices/dateFormate'
import { useAuth } from '@clerk/clerk-react'
import { useAppContext } from '../../context/AppContext'

const ListShows = () => {

    const currency = import.meta.env.VITE_CURRENCY

    const { axios, user } = useAppContext()
    const { getToken } = useAuth()

    const [show, setShow] = useState([])
    const [loading, setLoading] = useState(true)

    const getAllShow = async () => {
        try {

            const token = await getToken({ template: "default" })

            const { data } = await axios.get('/api/admin/all-shows', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShow(data.shows)
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if(user){
            getAllShow()
        }
    }, [user])

    return !loading ? (
        <>
            <Title text1="List" text2="Shows" />
            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
                    <thead>
                        <tr className='bg-primary/20 text-left text-white'>
                            <th className='p-2 font-medium pl-5'>Movie Name</th>
                            <th className='p-2 font-medium'>Show Time</th>
                            <th className='p-2 font-medium'>Total Booking</th>
                            <th className='p-2 font-medium'>Earning</th>
                        </tr>
                    </thead>
                    <tbody className='text-sm font-light'>
                        {show.map((show, index) => (
                            <tr key={index} className='border-b border-primary/10 bg-primary/5 even:bg-primary/10'>
                                <td className='p-2 min-w-45 pl-5'>{show.movie.title}</td>
                                <td className='p-2'>{dateFormate(show.showDateTime)}</td>
                                <td className='p-2'>{Object.keys(show.occupiedSeats).length}</td>
                                <td className='p-2'>{currency} {Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    )
}

export default ListShows