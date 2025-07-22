import React, { useEffect, useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import Loading from '../../component/Loading'
import Title from '../../component/admin/Title'
import { CheckIcon, DeleteIcon, StarIcon } from 'lucide-react'
import { kConverter } from '../../slices/kCoverter'
import { useAppContext } from '../../context/AppContext'
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'

const AddShows = () => {

    const { axios, user, image_base_url } = useAppContext()
    const { getToken } = useAuth()

    const currency = import.meta.env.VITE_CURRENCY

    const [nowPlayingMovies, setNowPlayingMovies] = useState([])
    const [selectedMovies, setSelectedMovies] = useState(null)
    const [dateTimeSelection, setDateTimeSelection] = useState({});
    const [dateTimeInput, setDateTimeInput] = useState("")
    const [showPrice, setShowPrice] = useState("")
    const [addingShow, setAddingShows] = useState(false)

    const fetchNowPlayingMovies = async () => {
        try {
            const token = await getToken({ template: "default" })
       
            const { data } = await axios.get('/api/show/now-playing', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setNowPlayingMovies(data.movies) 
            } else {
                console.error("Failed response:", data)
            }

        } catch (error) {
            console.error("Error fetching movies:", error.response?.data || error.message)
        }
    }


    useEffect(() => {
        if(user){
            fetchNowPlayingMovies()
        }
        
    }, [user])

    const handleDateTimeAdd = () => {
        if (!dateTimeInput) return
        const [date, time] = dateTimeInput.split("T");
        if (!date || !time) return

        setDateTimeSelection((prev) => {
            const times = prev[date] || [];
            if (time.includes(time)) {
                return {
                    ...prev,
                    [date]: [...times, time]
                };
            }
        })
    }

    const handleRemoveTime = (date, time) => {
        setDateTimeSelection((prev) => {
            const filteredTimes = prev[date].filter((t) => t !== time);
            if (filteredTimes.length === 0) {
                const { [date]: _, ...rest } = prev;
                return rest;
            }
            return {
                ...prev,
                [date]: filteredTimes,
            };
        })
    }

    const handleSubmit = async ()=>{
        try {
            setAddingShows(true)

            if(!selectedMovies || Object.keys(dateTimeSelection).length === 0 || !showPrice){
                return toast('Missing Required fields')
            }

            const showInput = Object.entries(dateTimeSelection).map(([date , time])=>({date,time}));

            const payload = {
                movieId: selectedMovies,
                showInput,
                showPrice: Number(showPrice)
            }
            const token = await getToken({ template: "default" })
       
            const { data } = await axios.post('/api/show/add', payload ,{
                headers: { Authorization: `Bearer ${token}` }
            })

            if(data.success){
                toast.success('show added successfully')
                setSelectedMovies(null)
                setDateTimeSelection({})
                setShowPrice("")
                setDateTimeInput("")
            }else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log("Submission error:",error)
            toast.error('An error occurrred. Please try again')
        }
        setAddingShows(false)
    }

    return nowPlayingMovies.length > 0 ? (
        <>
            <Title text1="Add" text2="Shows" />
            <p className='mt-10 text-lg font-medium'>Now Playing Movies</p>
            <div className=' pb-4'>
                <div className='group flex flex-wrap gap-4 mt-4 w-max'>
                    {
                        nowPlayingMovies.map((movie) => (
                            <div key={movie.id}
                                className={`relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300`}
                                onClick={() => setSelectedMovies(movie.id)}>
                                <div className='relative rounded-lg overflow-hidden'>
                                    <img src={image_base_url + movie.poster_path} alt="" className='w-full object-cover brightness-90' />
                                    <div className='text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0'>
                                        <p className='flex items-center gap-1 text-gray-400'>
                                            <StarIcon className='w-4 h-4 text-primary fill-primary' />
                                            {movie.vote_average.toFixed(1)}
                                        </p>
                                        <p className='text-gray-300'>{kConverter(movie.vote_count)} Votes</p>
                                    </div>
                                </div>
                                {selectedMovies === movie.id && (
                                    <div className='absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded'>
                                        <CheckIcon className='w-4 h-4 text-white' strokeWidth={2.5} />
                                    </div>
                                )}
                                <p className='font-medium truncate'>{movie.title}</p>
                                <p className='text-gray-400 text-sm'>{movie.release_date}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className='mt-15'>
                <label className='block text-sm font-medium mb-2'>Show price</label>
                <div className='inline-flex items-center gap-2 border border-gray-600 px-3 py-2 rounded-md'>
                    <p className='text-gray-400 text-sm'>{currency}</p>
                    <input min={0} type="number" value={showPrice}
                        onChange={(e) => setShowPrice(e.target.value)}
                        placeholder='Enter show price' className='outline-none' />
                </div>
            </div>


            <div className='mt-6'>
                <label className='block text-sm font-medium mb-2'>Select Date and Time</label>
                <div className='inline-flex gap-5 border border-gray-600 p-1 pl-3 rounded-lg'>
                    <input type="datetime-local" value={dateTimeInput}
                        onChange={(e) => setDateTimeInput(e.target.value)}
                        className='outline-none rounded-md' />
                    <button onClick={handleDateTimeAdd} className='bg-primary/80 text-white  px-4 py-3 text-sm rounded-lg hover:bg-primary cursor-pointer'>
                        Add Time
                    </button>
                </div>
            </div>


            {dateTimeSelection && Object.keys(dateTimeSelection).length > 0 && (
                <div className='mt-6'>
                    <h2 className='mb-2'>Selected Date-Time</h2>
                    <ul className='space-y-3'>
                        {Object.entries(dateTimeSelection).map(([date, time]) => (
                            <li key={date}>
                                <div className='font-medium'>{date}</div>
                                <div className='flex flex-wrap gap-2 mt-1 text-sm'>
                                    {time.map((time) => (
                                        <div key={time}
                                            className='border border-primary px-2 py-1 flex items-center rounded'>
                                            <span>{time}</span>
                                            <DeleteIcon onClick={() => handleRemoveTime(date, time)} width={15} className='ml-2 text-red-500 hover:text-red-700 cursor-pointer' />
                                        </div>
                                    ))}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <button onClick={handleSubmit} disabled={addingShow} className='bg-primary text-white px-8 py-2 mt-15 rounded-full hover:bg-primary/90 transition-all cursor-pointer'>
                    Add Show
                </button>
            </div>

        </>
    ) : (
        <Loading />
    )
}

export default AddShows