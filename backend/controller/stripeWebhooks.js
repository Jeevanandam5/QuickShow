import Stripe from "stripe";
import Booking from "../models/booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        // Use raw body if using Express body parser
        const rawBody = request.rawBody || request.body;
        event = stripeInstance.webhooks.constructEvent(
            rawBody, 
            sig, 
            process.env.STRIPE_WEBHOOK_KEY
        );
    } catch (error) {
        console.error(`Webhook Error: ${error.message}`);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;
                
                // Alternative approach to get booking ID
                const bookingId = paymentIntent.metadata?.bookingId;
                
                if (!bookingId) {
                    console.error("Booking ID not found in metadata");
                    return response.status(400).send("Missing booking ID");
                }

                const updated = await Booking.findByIdAndUpdate(
                    bookingId,
                    { 
                        isPaid: true, 
                        paymentLink: "",
                        paymentIntentId: paymentIntent.id
                    },
                    { new: true }
                );

                if (!updated) {
                    return response.status(404).send("Booking not found");
                }

                console.log("Payment marked as successful:", bookingId);

                await inngest.send({
                    name: "app/show.booked",
                    data: { bookingId }
                });

                break;
            }
        }

        response.json({ received: true });
    } catch (error) {
        console.error("Webhook processing error:", error);
        response.status(500).send("Internal Server Error");
    }
}