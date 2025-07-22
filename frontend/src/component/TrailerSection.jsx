import { useState } from 'react';
import { dummyTrailers } from '../assets/assets';
import { PlayCircleIcon } from 'lucide-react';
import BlurCircle from './BlurCircle';
import { Clock, Share2 } from 'lucide-react';


const getYouTubeID = (url) => {
    const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
};

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);

    return (
        <div className='px-4 sm:px-6 py-20 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
            <p className='text-gray-300 font-medium text-lg max-w-[960px]'>
                Trailers
            </p>

            <div className='relative mt-6'>
                <BlurCircle top='-100px' right='-100px' />

                <a href={currentTrailer.videoUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block relative mx-auto w-full max-w-full sm:w-[640px] md:w-[768px] lg:w-[960px] aspect-video'>
                    <img src={`https://img.youtube.com/vi/${getYouTubeID(currentTrailer.videoUrl)}/maxresdefault.jpg`}
                        alt='YouTube Trailer'
                        className='rounded-lg w-full h-full object-cover'/>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <PlayCircleIcon className='w-16 h-16 sm:w-20 sm:h-20 opacity-80' />
                    </div>

                    <div className='absolute top-4 right-4 flex flex-wrap gap-2 sm:gap-3'>
                        <div className='flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded-md cursor-pointer text-xs sm:text-sm'>
                            <Clock className='w-4 h-4' />
                            <span className='hidden sm:inline'>Watch Later</span>
                        </div>
                        <div className='flex items-center gap-1 text-white bg-black/50 px-2 py-1 rounded-md cursor-pointer text-xs sm:text-sm'>
                            <Share2 className='w-4 h-4' />
                            <span className='hidden sm:inline'>Share</span>
                        </div>
                    </div>

                    <img src='https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg'
                        alt='YouTube'
                        className='absolute bottom-3 right-4 w-20 sm:w-24 opacity-100'/>
                </a>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8 mt-8 max-w-6xl mx-auto px-1'>
                {dummyTrailers.map((trailer) => (
                    <div
                        key={trailer.image}
                        className='relative hover:translate-y-1 duration-300 transition max-h-40 sm:max-h-48 md:max-h-60 cursor-pointer'
                        onClick={() => setCurrentTrailer(trailer)}>
                        <img
                            src={trailer.image}
                            alt='trailer'
                            className='rounded-lg w-full h-full object-cover brightness-75'/>

                        <PlayCircleIcon
                            strokeWidth={1.6}
                            className='absolute top-1/2 left-1/2 w-6 h-6 md:w-8 md:h-8 transform -translate-x-1/2 -translate-y-1/2'/>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default TrailerSection;
