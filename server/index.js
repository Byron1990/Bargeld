if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");
const PORT = process.env.PORT_SERVER_CHECKOUT || 3001;

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  const { id, amount } = req.body;
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: id,
      description: "ECO USB",
      confirm: true,
    });
    console.log(payment);
    res.send({ message: "Pago exitoso" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.raw.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
