import React, { useEffect, useState } from 'react'
import { data, useNavigate, useParams } from 'react-router-dom'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../component/BlurCircle'
import { Heart, PlayCircleIcon, StarIcon } from 'lucide-react'
import timeformate from '../slices/timeformate'
import DateSelect from '../component/DateSelect'
import MovieCart from '../component/MovieCart'
import Loading from '../component/Loading'
import { useAppContext } from '../context/AppContext'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const MovieDetails = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)

  const { axios, user, shows, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext()
  const { getToken } = useAuth()

  const getShow = async () => {

    try {
      const { data } = await axios.get(`/api/show/${id}`)
      if (data.success) {
        setShow(data)
      }
    } catch (error) {
      console.log(error)
    }

  }

  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed")

      const token = await getToken({ template: "default" })

      const { data } = await axios.post('/api/user/update-favorite',{movieId: id}, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if(data.success){
        await fetchFavoriteMovies()
        toast.success(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getShow();
  }, [id])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-30 md:pt-50'>
      <div className='flex flex-col md:flex-row gap-30 max-w-6xl mx-auto'>
        <img src={image_base_url + show.movie.poster_path} alt="" className='max-md:mx-auto rounded-xl h-104 max-w-70 object-cover' />

        <div className='relative flex flex-col gap-3'>

          <BlurCircle top='-100px' left='-100px' />
          <p className='text-primary'>ENGLISH</p>

          <h1 className='text-4xl font-semibold max-w-96 text-balance mb-5'>{show.movie.title}</h1>

          <div className='flex items-center gap-2 text-gray-300'>
            <StarIcon className='w-5 h-5 text-primary fill-primary' />
            {show.movie.vote_average.toFixed(1)} User Rating
          </div>

          <p className='text-gray-400 mt-2 text-sm leading-tight max-w-xl mb-3'>
            {show.movie.overview}
          </p>

          <p>
            {timeformate(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(" , ")} • {show.movie.release_date.split("-")[0]}
          </p>

          <div className='flex items-center flex-wrap gap-4 mt-4'>

            <button onClick={() => window.open(show.movie.trailerUrl, '_blank')}
              className='flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-full font-medium cursor-pointer active:scale-95'>
              <PlayCircleIcon className='w-5 h-5' />
              Watch Trailer
            </button>

            <a href="#dateSelect" className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
              Buy Tickets
            </a>

            <button onClick={handleFavorite} className='bg-gray-700p-2.5 rounded-full transition cursor-pointer active:scale-95'>
              <Heart className={`w-5 h-5${favoriteMovies.find(movie => movie._id === id)? "fill-primary text-primary" : ""}`} fill={favoriteMovies.find(movie => movie._id === id) ? "currentColor" : "none"}/>
            </button>
          </div>
        </div>
      </div>

      <p className='text-lg font-medium mt-20'>Your Favorite Cast</p>
      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
          {show.movie.casts.slice(0, 12).map((cast, index) => (
            <div key={index} className='flex flex-col items-center text-center'>
              <img src={image_base_url + cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover' />
              <p className='font-medium text-xs mt-4'>{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      <DateSelect dateTime={show.dateTime} id={id} />

      <p className='text-lg font-medium mt-20 mb-20'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {shows.slice(0, 4).map((movie, index) => (
          <MovieCart key={index} movie={movie} />
        ))}
      </div>
      <div className='flex justify-center mt-20'>
        <button onClick={() => { navigate("/movie"); scrollTo(0, 0) }} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
          Show More
        </button>
      </div>
    </div>
  ) : (
    <Loading />
  )
}

export default MovieDetails