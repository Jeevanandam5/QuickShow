import { clerkClient, getAuth } from "@clerk/express";
import Booking from "../models/booking.js";
import Movie from "../models/movie.js";

export const getUserBooking = async (req, res) => {
    try {
        const user = req.auth().userId;

        const bookings = await Booking.find({ user }).populate({
            path: "show",
            populate: { path: "movie" }
        }).sort({ createdAt: -1 })
        res.json({ success: true, bookings })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}


export const updateFavorite = async (req, res) => {
    try {

        const { movieId } = req.body;
        const userId = req.auth().userId;

        const user = await clerkClient.users.getUser(userId)

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = []
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId)
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata })

        res.json({ success: true, message: "Favorite movies updated" })

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message })
    }
}

export const getFavorites = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const user = await clerkClient.users.getUser(userId);
        const favorites = user.privateMetadata.favorites || [];

        const movie = await Movie.find({ _id: { $in: favorites } });

        res.json({ success: true, movie });
    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: error.message });
    }
}

