import Stripe from "stripe";
import Booking from "../models/booking.js";
import { inngest } from "../Inngest/index.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_KEY
    );
  } catch (error) {
    console.log("Webhook signature error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    let bookingId = null;

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      bookingId = session.metadata?.bookingId;
      console.log("Webhook: checkout.session.completed");
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;

      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: intent.id,
        limit: 1,
      });

      const session = sessions.data[0];
      bookingId = session?.metadata?.bookingId;
      console.log("Webhook: payment_intent.succeeded");
    }

    if (!bookingId) {
      console.log("Booking ID missing in metadata");
      return response.status(400).send("Missing booking ID");
    }

    const updated = await Booking.findByIdAndUpdate(
      bookingId,
      { isPaid: true, paymentLink: "" },
      { new: true }
    );

    if (!updated) {
      console.log(" Booking not found in DB");
      return response.status(404).send("Booking not found");
    }

    console.log(" Booking marked as paid:", updated._id);

    // Send confirmation email via Inngest
    await inngest.send({
      name: "app/show.booked",
      data: { bookingId },
    });

    response.json({ received: true });
  } catch (error) {
    console.log(" Webhook processing error:", error);
    response.status(500).send("Internal server error");
  }
};
