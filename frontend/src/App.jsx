import NavBar from './component/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movie from './pages/Movie'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBooking from './pages/MyBooking'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './component/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBooking from './pages/admin/ListBooking'

const App = () => {

  const isAdimeRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Toaster />
      {!isAdimeRoute && <NavBar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie' element={<Movie />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
        <Route path='/movie/:id/:date' element={<SeatLayout />} />
        <Route path='/my-booking' element={<MyBooking />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/admin/*' element={<Layout/>}>
          <Route index element={<Dashboard/>} />
          <Route path='add-shows' element={<AddShows/>} />
          <Route path='list-shows' element={<ListShows/>} />
          <Route path='list-booking' element={<ListBooking/>} />
        </Route>
      </Routes>
      {!isAdimeRoute && <Footer />}
    </>
  )
}

export default App