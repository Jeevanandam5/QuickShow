
const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
        <h2 className="text-xl font-semibold animate-pulse text-primary">Loading, please wait...</h2>
      </div>
    </div>
  )
}

export default Loading
