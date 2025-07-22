import React, { useEffect, useState } from 'react'
import Loading from '../component/Loading'
import BlurCircle from '../component/BlurCircle'
import timeformate from '../slices/timeformate'
import { dateFormate } from '../slices/dateFormate'
import { useAuth } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

const MyBooking = () => {
  const currency = import.meta.env.VITE_CURRENCY
  const { axios, user, image_base_url } = useAppContext()
  const { getToken } = useAuth()

  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const getMyBooking = async () => {
    try {
      const token = await getToken({ template: "default" })
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (user) {
      getMyBooking()
    }
  }, [user])

  return !isLoading ? (
    <div className="relative px-4 sm:px-6 md:px-16 lg:px-40 pt-28 md:pt-36 min-h-[80vh]">
      <BlurCircle top='100px' left='100px' />
      <BlurCircle bottom='0px' left='600px' />
      
      <h1 className="text-xl md:text-2xl font-semibold mb-6 text-white">My Booking</h1>

      {bookings.map((item, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row justify-between items-start md:items-center bg-primary/8 border border-primary/20 rounded-lg p-4 mb-6 max-w-4xl  "
        >
          {/* Left Block */}
          <div className="flex flex-col sm:flex-row gap-4">
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt={item.show.movie.title}
              className="w-full sm:w-28 aspect-video object-cover rounded"
            />
            <div className="flex flex-col justify-between">
              <p className="text-white text-base font-semibold">{item.show.movie.title}</p>
              <p className="text-gray-400 text-sm">{timeformate(item.show.movie.runtime)}</p>
              <p className="text-gray-400 text-sm">{dateFormate(item.show.showDateTime)}</p>
            </div>
          </div>

          {/* Right Block */}
          <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end md:text-right w-full md:w-auto">
            <div className="flex items-center gap-4 mb-2">
              <p className="text-white text-xl font-semibold">
                {currency}{item.amount}
              </p>
              {!item.isPaid && item.paymentLink && (
                <Link
                  to={item.paymentLink}
                  className="bg-primary px-4 py-1.5 text-sm rounded-full font-medium text-white hover:bg-primary/90"
                >
                  Pay Now
                </Link>
              )}
            </div>
            <div className="text-sm text-white space-y-1">
              <p><span className="text-gray-400">Total Tickets: </span>{item.bookedSeats?.length || 0}</p>
              <p><span className="text-gray-400">Seat Number: </span>{item.bookedSeats?.join(", ") || "-"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loading />
  )
}

export default MyBooking
