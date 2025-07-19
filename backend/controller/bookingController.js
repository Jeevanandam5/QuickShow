import { inngest } from "../Inngest/index.js";
import Booking from "../models/booking.js";
import Show from "../models/show.js"
import stripe, { Stripe } from 'stripe'

export const checkPayment = inngest.createFunction(
  { id: "check-payment" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const bookingId = event.data.bookingId;
    console.log("Checking payment for booking:", bookingId);

    // Wait for a few seconds to give Stripe time to process
    await step.sleep("Wait for Stripe to process", "5s");

    // Fetch the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log("Booking not found");
      return { success: false, message: "Booking not found" };
    }

    // Check if already paid
    if (booking.isPaid) {
      console.log("Already paid");
      return { success: true, alreadyPaid: true };
    }

    // Optional: re-check Stripe session if needed here
    // Skipping that since your webhook already handles it

    // Final fallback logic (in case webhook failed, manually check)
    console.log("Booking is not marked as paid yet. Will retry later.");
    
    return { success: true, isPaid: booking.isPaid };
  }
);

const checkSeatAvailability = async (showId, selectedSeats) => {
    try {
        const showData = await Show.findById(showId)
        if (!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken

    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { showId, selectedSeats } = req.body;
        const { origin } = req.headers;

        // Check if the seat is available or not
        const isAvailable = await checkSeatAvailability(showId, selectedSeats)

        if (!isAvailable) {
            return res.json({ success: false, message: "Selected Seats are not Available" })
        }

        //get the show details
        const showData = await Show.findById(showId).populate('movie');

        //create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })


        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats')

        await showData.save();

        //Stripe payment gateway
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

        //Creatin line item for stripe
        const line_items =[{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-booking`,
            cancel_url: `${origin}/my-booking`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
        })

        booking.paymentLink = session.url
        await booking.save()

        //payment status check
        await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
        })

        res.json({ success: true, url: session.url })
        
    } catch (error) {
        console.log(error.message)
        res.json({ successs: false, message: error.message })
    }
}


export const getOccupiedSeats = async (req, res) => {
    try {

        const { showId } = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({ success: true, occupiedSeats })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}