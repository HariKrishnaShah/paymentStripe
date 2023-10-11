const router = require("express").Router();
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51Nzg3OSHM6bm1GKqoRZ6jf7YGpndDUoQMfSgf16PjfwU8ujW4dhKjyV6TQtqWq51Yu0VGPVU8MSqbBe3wkZUEka100cTRA89O6');

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return (items.price);
};

router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  console.log("items are " + {items});

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

module.exports = router;


