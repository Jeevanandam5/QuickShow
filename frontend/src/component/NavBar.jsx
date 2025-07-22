import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useState } from 'react'
import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()
    const { isSignedIn } = useUser()
    const navigate = useNavigate()

    const { favoriteMovies } = useAppContext()

    return (
        <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
            <Link to="/">
                <img src={assets.logo} alt="" className='w-36 h-auto' />
            </Link>
            <div className={`z-50 flex flex-col md:flex-row items-center gap-8 py-3 md:px-8 md:rounded-full md:bg-white/10 md:border border-gray-300/20  backdrop-blur transition-[width] duration-300 overflow-hidden  max-md:fixed max-md:top-1/2 max-md:left-1/2 max-md:transform max-md:-translate-x-1/2 max-md:-translate-y-1/2  max-md:bg-black/70 max-md:font-medium max-md:text-lg max-md:items-center max-md:justify-center max-md:text-center  ml-auto
                 ${isOpen ? 'max-md:w-screen max-md:h-screen' : 'max-md:w-0 max-md:h-0'}`}>

                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Home</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="movie">Movies</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Theatres</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/movie">Releases</Link>
                {favoriteMovies?.length > 0 && <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/favorite">Favorites</Link>
                }
            </div>
            <div className='flex items-center justify-end md:gap-8 ml-auto'>
                <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
                {!isSignedIn ? (
                    <SignInButton mode='modal'>
                        <button className='md:px-4 md:py-2 bg-primary hover:bg-primary/90 transition rounded-full font-medium text-white'>
                            Sign In
                        </button>
                    </SignInButton>
                ) : (
                    <div className='flex gap-2'>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-booking')} />
                            </UserButton.MenuItems>
                        </UserButton>
                    </div>
                )}
            </div>

            <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

        </div>

    )
}

export default NavBar