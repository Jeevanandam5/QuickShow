import { Inngest } from "inngest";
import User from "../models/user.js";
import Booking from "../models/booking.js";
import Show from "../models/show.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

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

// Inngest Function to save the user from database
const syncUserCreation = inngest.createFunction(
    {id: 'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event}) =>{
        const { 
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        }=event.data

        const userdata = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + '' +last_name,
            image: image_url
        }
        await User.create(userdata) 
    }
)

// Inngest function to delete user from database
const syncUserDelete = inngest.createFunction(
    {id: 'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async ({event}) =>{
        const {id} = event.data
        await User.findByIdAndDelete(id) 
    }
)

// Inngest function to Update user from database
const syncUserUpdate = inngest.createFunction(
    {id: 'update-user-with-clerk'},
    {event: 'clerk/user.updated'},
    async ({event}) =>{

         const { 
            id,
            first_name,
            last_name,
            email_addresses,
            image_url
        }=event.data

        const userdata = {
            _id: id,
            email: email_addresses[0].email_address,
            name: first_name + '' +last_name,
            image: image_url
        }
        await User.findByIdAndUpdated(id , userdata , { new: true })
    }
)


//Inngest function  to cancle booking and release the seats and show if payment is not made

const releaseSeatsAndBooking = inngest.createFunction(
    {id: 'release-seats-delete-booking'},
    {event: "app/checkpayment"},
    async ({ event , step})=>{
        const oneMinutesLater = new Date(Date.now() + 1 * 60 * 1000);
        await step.sleepUntil('wait-for-1-minutes' , oneMinutesLater)

        await step.run('check-payment-status' , async ()=>{
            const bookingId = event.data.bookingId;
            const booking = await Booking.findById(bookingId)

            //check payment status
            if(!booking.isPaid){
                const show = await Show.findById(booking.show);
                booking.bookedSeats.forEach((seat)=>{
                    delete show.occupiedSeats[seat]
                });
                show.markModified('occupiedSeats')
                await show.save()
                await Booking.findByIdAndDelete(booking._id)
            }
        })
    }
)




export const functions = [syncUserCreation,syncUserDelete,syncUserUpdate,releaseSeatsAndBooking];