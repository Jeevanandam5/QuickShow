import Stripe from "stripe";
import Booking from "../models/booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
    const sig = request.headers["stripe-signature"]

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_KEY)
    } catch (error) {
        return response.status(400).send(`webhook Error: ${error.message}`)
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                // Get session to access metadata
                const session = await stripeInstance.checkout.sessions.list({
                    payment_intent: paymentIntent.id,
                    limit: 1
                });

                const matchedSession = session.data[0];
                const bookingId = matchedSession?.metadata?.bookingId;

                if (!bookingId) {
                    console.error("Booking ID not found in metadata");
                    return response.status(400).send("Missing booking ID");
                }

                const updated = await Booking.findByIdAndUpdate(
                    bookingId,
                    { isPaid: true, paymentLink: "" },
                    { new: true }
                );

                if (!updated) {
                    return response.status(404).send("Booking not found");
                }

                console.log(" Payment marked as successful:", bookingId);

                await inngest.send({
                    name: "app/show.booked",
                    data: { bookingId }
                });

                break;
            }
        }

            response.json({ received: true })
        } catch (error) {
            console.log("webhook processing error:", error)
            response.status(500).send("Internal server Error")
        }
    }