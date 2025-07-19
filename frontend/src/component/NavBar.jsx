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
            <div className={`z-50 flex flex-col md:flex-row items-center gap-8 py-3 max-md:justify-center max-md:absolute max-md:top-0 max-md:left-0 max-md:h-screen max-md:font-medium max-md:text-lg min-md:px-8 min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>

                <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />

                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Home</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="movie">Movies</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Theatres</Link>
                <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/">Releases</Link>
                {favoriteMovies?.length > 0 && <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} to="/favorite">Favorites</Link>
}
            </div>
            <div className='flex items-center gap-8'>
                <SearchIcon className="max-md:hidden w-6 h-6 cursor-pointer" />
                {!isSignedIn ? (
                    <SignInButton mode='modal'>
                        <button className='px-4 py-2 bg-primary hover:bg-primary/90 transition rounded-full font-medium text-white'>
                            Sign In
                        </button>
                    </SignInButton>
                ) : (
                    <div className='flex items-center gap-2'>
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/my-booking')}/>
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