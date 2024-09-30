import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Transaction } from "../models/transactionsSchema.js";

// Get the transaction made 5 minutes ago or the most recent one for the logged-in user
export const getPaymentSuccessTransaction = catchAsyncError(async (req, res, next) => {
    
  const userId = req.user._id; // Assuming the auth middleware attaches the logged-in user to req.user
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // 5 minutes ago from current time
    
  // Look for transactions made in the last 5 minutes for the logged-in user
  const recentTransaction = await Transaction.findOne({
    user: userId,
    date: { $gte: fiveMinutesAgo },
    transaction_status: "successful", // Assuming you are looking for successful transactions only
  }).sort({ date: -1 });

  if (recentTransaction) {
    // If a transaction was found within the last 5 minutes, return it with a "fresh" flag
    return res.status(200).json({
      success: true,
      flag: "fresh",
      transaction: recentTransaction,
    });
  }

  // If no transaction was found in the last 5 minutes, get the most recent one for the logged-in user regardless of the time
  const mostRecentTransaction = await Transaction.findOne({
    user: userId,
  }).sort({ date: -1 });

  if (!mostRecentTransaction) {
    return next(new ErrorHandler("No transactions found for this user", 404));
  }

  // Return the most recent transaction with a "recent" flag
  res.status(200).json({
    success: true,
    flag: "recent",
    transaction: mostRecentTransaction,
  });
});

export const getAlltransactions = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
  
    // Fetch all transactions for the logged-in user
    const transactions = await Transaction.find({ user: userId });
  
    if (!transactions.length) {
        console.log('No transactions')
      return next(new ErrorHandler("No transactions found for this user", 404));
    }
  
    res.status(200).json({
      success: true,
      transactions,
    });
  });
  