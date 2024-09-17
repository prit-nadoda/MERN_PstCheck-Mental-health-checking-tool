import { User } from "../models/userModel.js"; // Adjust the path as needed

export const checkUserSubscription = async (req, res, next) => {
  try {
    const user = req.user; // Assuming req.user is set by the isAuthenticated middleware

    // If user has a premium plan, allow access
    if (user.subscription.plan === "premium") {
      return next();
    }

    // If user has a free plan, check credits
    if (user.subscription.plan === "free") {
      if (user.subscription.credits <= 0) {
        return res.status(403).json({
          success: false,
          message: "You have run out of credits. Please upgrade to premium.",
        });
      }

      // Deduct 25 credits and update the user in the database
      user.subscription.credits -= 25;
      await user.save(); // Save the updated user in the database
      return next();
    }

    // If no valid subscription plan found
    return res.status(403).json({
      success: false,
      message: "Invalid subscription plan.",
    });

  } catch (error) {
    console.error("Error in checkSubscription middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

