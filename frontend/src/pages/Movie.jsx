import { dummyShowsData } from "../assets/assets"
import BlurCircle from "../component/BlurCircle"
import MovieCart from "../component/MovieCart"


const Movie = () => {
  return dummyShowsData.length > 0 ? (
    <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">

      <BlurCircle top="150px" left="0px"/>
      <BlurCircle bottom="50px" right="50px"/>

      <h1 className="text-lg font-medium my-4">Now Showing</h1>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {
          dummyShowsData.map((movie)=>(
            <MovieCart movie={movie} key={movie._id}/>
          ))
        }
      </div>
    </div>
  ) : (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-gray-900 text-white rounded-xl shadow-md">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">🎬 No Movies Available</h1>
    </div>
  )
}

export default Movie