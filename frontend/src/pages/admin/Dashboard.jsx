import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react'
import { dummyDashboardData } from '../../assets/assets';
import Loading from '../../component/Loading';
import Title from '../../component/admin/Title';
import BlurCircle from '../../component/BlurCircle';
import { dateFormate } from '../../slices/dateFormate';

const Dasnboard = () => {

  const currency = import.meta.env.VITE_CURRENCY

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  })

  const [loading, setLoading] = useState(true);

  const dashboardCards = [

    { title: "Total Bookings", value: dashboardData.totalBookings || "0", icon: ChartLineIcon },
    { title: "Total Revenue", value: currency + dashboardData.totalRevenue || "0", icon: CircleDollarSignIcon },
    { title: "Active Shows", value: dashboardData.activeShows.length || "0", icon: PlayCircleIcon },
    { title: "Total Users", value: dashboardData.totalUser || "0", icon: UsersIcon }

  ]

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData)
    setLoading(false)
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className='relative mt-10 max-w-[100%] mx-auto'>
        <BlurCircle top='-100px' left='0' />

        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10'>
          {dashboardCards.map((card, index) => (
            <div key={index}
              className='flex items-center justify-between gap-x-4 px-3 py-2 bg-primary/10 border border-primary/20 rounded-md max-w-[180px] w-full'>
              <div>
                <h1 className='text-sm'>{card.title}</h1>
                <p className='text-lg font-medium mt-1'>{card.value}</p>
              </div>
              <card.icon className='w-6 h-6 text-primary' />
            </div>
          ))}
        </div>


        <p className='mt-10 mb-5 text-lg font-medium'>Active Shows</p>
        <div className='relative flex flex-wrap gap-6 mt-4 max-w-5xl mx-auto'>
          <BlurCircle top='100px' left='-10px' />
          {dashboardData.activeShows.map((show) => (
            <div key={show._id}
              className='w-55 rounded-lg overflow-hidden h-full pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300'>
              <img src={show.movie.poster_path} alt="" className='h-50 w-full object-cover' />
              <p className='font-medium p-2 truncate'>{show.movie.title}</p>
              <div className='flex items-center justify-between px-2'>
                <p className='text-lg font-medium'>{currency} {show.showPrice}</p>
                <p className='flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1'>
                  <StarIcon className='w-4 h-4 text-primary fill-primary' />
                  {show.movie.vote_average.toFixed(1)}
                </p>
              </div>
              <p className='px-2 pt-2 text-sm text-gray-500'>{dateFormate(show.showDateTime)}</p>
            </div>
          ))}
        </div>
      </div>

    </>
  ) : (
    <Loading />
  )
}

export default Dasnboard