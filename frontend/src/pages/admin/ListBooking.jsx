import React, { useEffect, useState } from 'react'
import Loading from '../../component/Loading'
import Title from '../../component/admin/Title'
import { dateFormate } from '../../slices/dateFormate'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'

const ListBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, user } = useAppContext()
  const { getToken } = useAuth()

  const [booking, setBooking] = useState([])
  const [loading, setLoading] = useState(true)

  const getAllBooking = async () => {
    try {
      const token = await getToken({ template: 'default' })
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setBooking(data.bookings)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (user) {
      getAllBooking()
    }
  }, [user])

  return !loading ? (
    <>
      <Title text1="List" text2="Bookings" />
      <div className="mt-6 overflow-x-auto max-w-full">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap min-w-[600px]">
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5 min-w-[150px]">User Name</th>
              <th className="p-2 font-medium min-w-[150px]">Movie Name</th>
              <th className="p-2 font-medium min-w-[180px]">Show Time</th>
              <th className="p-2 font-medium min-w-[120px]">Seats</th>
              <th className="p-2 font-medium min-w-[100px]">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {booking.map((item, index) => (
              <tr
                key={index}
                className="border-b border-primary/10 bg-primary/5 even:bg-primary/10">
                <td className="p-2 pl-5">{item?.user?.name}</td>
                <td className="p-2">{item?.show?.movie?.title}</td>
                <td className="p-2">
                  {dateFormate(item?.show?.showDateTime)}
                </td>
                <td className="p-2">
                  {Object.values(item?.bookedSeats || {}).join(', ')}
                </td>
                <td className="p-2">
                  {currency} {item?.amount}
                </td>
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

export default ListBooking
