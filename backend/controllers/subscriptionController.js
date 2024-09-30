import Stripe from "stripe";
import { User } from "../models/userSchema.js";
import { Subscription } from "../models/subscriptionSchema.js";
import { Transaction } from "../models/transactionsSchema.js";
import { sendEmail } from "../utils/emailService.js";

export const getCheckoutSession = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const subscription = await Subscription.findById(req.params.subId);
  try {
    const stripe = new Stripe(`${process.env.STRIPE_SECRET}`);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL_USER}/payment/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/pricing`,
      customer_email: `${req.user.email}`,
      client_reference_id: `${req.user._id}`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: subscription.name,
              description: subscription.description,
              images: [
                "https://example.com/image/upload/v1621123456/example-image.jpg",
              ],
            },
            unit_amount: subscription.amount * 100,
          },
          quantity: 1,
        },
      ],
    });
    const transaction = new Transaction({
      user: req.user._id,
      plan: subscription._type,
      session_id: session.id,
      amount: subscription.amount,
      transaction_status: session.payment_status,
      payment_intent_id: session.payment_intent,
    });
    await transaction.save();

    user.subscription.plan = "plus";
    user.transactions.push(transaction._id);
    await user.save();

    // Sending the email notification with the design
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Successful</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            text-align: center;
            font-family: 'Outfit', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
          }

          .container {
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 60px 16px;
            background-color: #ffffff;
          }

          .payment-card {
            width: 100%;
            max-width: 400px;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .payment-icon {
            position: relative;
            width: 160px;
            height: 160px;
            margin-bottom: 32px;
          }

          .circle-1 {
            position: absolute;
            inset: 0;
            background-color: #f6f5ff;
            border-radius: 50%;
          }

          .circle-2 {
            position: absolute;
            inset: 15px;
            background-color: #e6edfb;
            border-radius: 50%;
          }

          .circle-3 {
            position: absolute;
            inset: 30px;
            background-color: #ccd8f9;
            border-radius: 50%;
          }

          .circle-4 {
            position: absolute;
            inset: 45px;
            background-color: #3467da;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon-check {
            width: 48px;
            height: 48px;
            stroke: white;
          }

          .payment-title {
            font-size: 24px;
            font-weight: bold;
            color: #3467da;
            margin-bottom: 8px;
          }

          .payment-description {
            font-size: 14px;
            color: #707070;
            text-align: center;
            margin-bottom: 32px;
          }

          .payment-details {
            width: 100%;
            background-color: #f6f5ff;
            border-radius: 8px;
            padding: 24px;
          }

          .payment-details .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            color: #3467da;
          }

          .item-total {
            border-top: 1px solid #c4c4c4;
            padding-top: 16px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="payment-card">
            <div class="payment-icon">
              <div class="circle-1"></div>
              <div class="circle-2"></div>
              <div class="circle-3"></div>
              <div class="circle-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon-check">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
            </div>

            
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      email: req.user.email, // recipient's email
      subject: "Subscription Successful", // email subject
      html: emailHtml, // full HTML email content
    });

    res.status(200).json({
      success: true,
      message: "Transaction completed successfully",
      session,
    });
  } catch (error) {
    console.error("Error in getCheckoutSession:", error); // Log the error for debugging
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};



export const getAllPlans = async (req, res) => {
  try {
    const plans = await Subscription.find({});

    if (!plans || plans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No subscription plans found.",
      });
    }

    return res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
