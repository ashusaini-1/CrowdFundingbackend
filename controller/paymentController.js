const Payment = require("../models/paymentModel");

const Razorpay = require("razorpay");


var instance = new Razorpay({
  key_id: "rzp_test_Bc1hoCUsDsq3ZA",
  key_secret: "aeeySctKTREtr7SMSoijo4re",
});
const crypto = require("crypto");

module.exports.checkout = async (req, res) => {
  try {
    // Assuming req.body.amount is a valid number
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    // Correct method to create an order with Razorpay
    instance.orders.create(options, async function (err, order) {
      if (err) {
        // Handle the error if any
        // console.error("Error during order creation:", err);
        res.status(500).json({
          success: false,
          message: "Error during order creation.",
        });
      } else {
        // Order successfully created
        // console.log(order);
        res.status(200).json({
          success: true,
          order,
        });
      }
    });
  } catch (error) {
    // Handle any other errors that might occur during the execution
    // console.error("Error during checkout:", error);
    res.status(500).json({
      success: false,
      message: "Error during checkout.",
    });
  }
};

module.exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
const ids="aeeySctKTREtr7SMSoijo4re";
  const expectedSignature = crypto
    .createHmac("sha256", ids)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(`c?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
};
