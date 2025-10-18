import express from "express";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import Razorpay from "razorpay";

dotenv.config();

const app = express();
app.use(express.json());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const domain = process.env.DOMAIN || "http://localhost:5173";

if (!stripeSecret) {
  console.warn("STRIPE_SECRET_KEY is not set. Server will not be able to create sessions.");
}

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2022-11-15" }) : null;

// Initialize Razorpay if keys are present
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = razorpayKeyId && razorpayKeySecret ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret }) : null;

app.post("/create-checkout-session", async (req, res) => {
  if (!stripe) return res.status(500).send("Stripe not configured");

  const { amount } = req.body;
  if (!amount || typeof amount !== "number") return res.status(400).send("Invalid amount");

  try {
    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Support - $${amount}`,
              description: `${amount} USD support donation`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${domain}/?success=true`,
      cancel_url: `${domain}/?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create checkout session");
  }
});

// Enable CORS for development and simple usage
app.use(cors());

// Create Razorpay order for INR payments (supports UPI in Razorpay Checkout)
app.post("/create-razorpay-order", async (req, res) => {
  if (!razorpay) return res.status(500).send("Razorpay not configured");

  const { amount } = req.body;
  if (!amount || typeof amount !== "number") return res.status(400).send("Invalid amount");

  try {
    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, key: razorpayKeyId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create Razorpay order");
  }
});

// Verify Razorpay payment (signature verification)
import crypto from "crypto";

app.post("/verify-razorpay", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return res.status(400).send("Missing fields");

  const generated_signature = crypto
    .createHmac("sha256", razorpayKeySecret || "")
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Payment is legitimate; you can save it to DB or trigger post-payment actions here
    return res.json({ ok: true });
  }

  return res.status(400).json({ ok: false, error: "Invalid signature" });
});

const port = process.env.PORT || 4242;
app.listen(port, () => console.log(`Server listening on port ${port}`));
