import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { data, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const DateSelect = ({ dateTime, id }) => {

    const navigate = useNavigate()

    const [selected , setSelected] = useState()

    const onBookHandle = ()=>{
        if(!selected){
            return toast("Please Select a date")
        }
        navigate(`/movie/${id}/${selected}`)
        scrollTo(0,0)
    }

    return (
        <div id='dateSelect' className='pt-30'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20 rounded-lg'>
                <BlurCircle top='-100px' left='-100px' />
                <BlurCircle top='100px' left='0px' />
                <div>
                    <p className='text-lg font-semibold'> Choose Date </p>
                    <div className='flex items-center gap-6 text-sm mt-5'>
                        <ChevronLeftIcon width={28} />
                        <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                            {dateTime && Object.keys(dateTime).map((dateKey) => {
                                const date = new Date(dateKey);
                                return (
                                    <button key={dateKey} onClick={()=> setSelected(dateKey)}
                                    className={`flex flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === dateKey ? "bg-primary text-white" : "border border-primary/70"}`}>
                                        <span>{date.getDate()}</span>
                                        <span>{date.toLocaleDateString("en-US", { month: "short" })}</span>
                                    </button>
                                );
                            })}
                        </span>

                        <ChevronRightIcon width={28} />
                    </div>
                </div>
                <button onClick={onBookHandle} className='bg-primary text-white px-8 py-2 mt-6 rounded-full hover:bg-primary/90 transition-all cursor-pointer'>
                    Book Now
                </button>
            </div>
        </div>
    )
}

export default DateSelect