const timeformate = (minutes) =>{
    const houre = Math.floor(minutes / 60)
    const minutesRemainder = minutes % 60
    return `${houre}h ${minutesRemainder}m`
}

export default timeformate