import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwkToken.js";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";
import { Question } from "../models/questionSchema.js";

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const { fullname, email, number, password, type } = req.body;

  if (!fullname || !email || !number || !password || !type) {
    return next(new ErrorHandler("Please fill all the fields!", 400));
  }

  let isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(
      new ErrorHandler(
        "User already registered with the given Email Address!",
        400
      )
    );
  }

  const user = await User.create({
    fullname: fullname,
    email: email,
    number: number,
    password: password,
    type: type,
  });

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  await user.save();

  // Create verification URL
  const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

  // Send verification email
  const plainTextMessage = `Please verify your email by clicking the following link:\n\n${verificationUrl}\n\nIf you did not register with us, please ignore this email.`;
  const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Email Verification</title>
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
          max-width: 600px;
          margin: 50px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
          text-align: center;
        }

        .header img {
          max-width: 150px;
        }

        .content {
          margin-top: 20px;
          color: #333;
          line-height: 1.6;
        }

        .button {
          display: inline-block;
          background-color: #1a73e8;
          color: #fff;
          padding: 10px 20px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          text-align: center;
          font-size: 16px;
          font-weight: 700;
          border: none;
          cursor: pointer;
        }

        .footer {
          margin-top: 30px;
          font-size: 0.9em;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://res.cloudinary.com/dbhwmmzmi/image/upload/v1722318274/flh9i9v1o0zbqjtldwtz.png" alt="Company Logo">
        </div>
        <div class="content">
          <h1>Email Verification Required</h1>
          <p>Hello,</p>
          <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
          <p style="text-align: center;">
          
          <a href="${verificationUrl}">
            <button type="submit" class="button">Verify Email</button>
          </a>
          </p>
          <p>If you did not register with us, please ignore this email or contact support if you have questions.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 PsyCheck. All rights reserved.</p>
          <p>If you have any questions, please contact us at <a href="mailto:psycheck.notify@gmail.com">psycheck.notify@gmail.com</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      text: plainTextMessage,
      html: htmlMessage,
    });

    generateToken(
      user,
      "Patient registered successfully! Please verify your email.",
      200,
      res
    );
  } catch (error) {
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

export const verifyUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const verificationToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Verification token is invalid or has expired", 400)
    );
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type) {
    return next(new ErrorHandler("Please provide full information!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password!", 400));
  }

  if (type !== user.type) {
    return next(new ErrorHandler("You are not authorized for this Role", 400));
  }
  generateToken(user, "You are logged in successfully!", 200, res);
});

export const addNewAdmin = catchAsyncError(async (req, res, next) => {
  const { fullname, email, number, password } = req.body;
  if (!fullname || !email || !number || !password) {
    return next(new ErrorHandler("Please provide full information!", 400));
  }
  const isAlreadyExist = await User.findOne({ email });
  if (isAlreadyExist) {
    return next(
      new ErrorHandler(
        `${isAlreadyExist.type} with this email already registered!`,
        400
      )
    );
  }

  const Admin = await User.create({
    fullname: fullname,
    email: email,
    number: number,
    password: password,
    type: "Admin",
  });
  Admin
    ? res
        .status(200)
        .json({ success: true, message: "Admin Added Successfully!" })
    : res
        .status(400)
        .json({ success: false, message: "Failed to add new Admin!" });
});

export const getAllDoctors = catchAsyncError(async (req, res, next) => {
  const doctors = await User.find({ type: "Doctor" });
  res.status(200).json({
    success: true,
    doctors,
  });
});

export const getUserInfo = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logoutAdmin = catchAsyncError((req, res, next) => {
  res
    .status(200)
    .cookie("adminToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Admin logged out successfully!",
    });
});
export const logoutPatient = catchAsyncError((req, res, next) => {
  res
    .status(200)
    .cookie("patientToken", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Patient logged out successfully!",
    });
});

export const addNewDoctor = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files) === 0) {
    return next(new ErrorHandler("Doctor Avatar is missig!", 400));
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/jpg", "image/jpeg", "image/webp", "image/png"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return next(new ErrorHandler("This file format is not supported!", 400));
  }
  const {
    firstname,
    lastname,
    email,
    number,
    age,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !number ||
    !age ||
    !gender ||
    !password ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please provide full information!", 400));
  }
  const isAlreadyExist = await User.findOne({ email });
  if (isAlreadyExist) {
    return next(
      new ErrorHandler(
        `${isAlreadyExist.type} is already registrated with given Email!`,
        400
      )
    );
  }

  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      `Cloudinary Error : ${
        cloudinaryResponse.error.message || "Unknown Cloudinary Error"
      }`
    );
  }
  const doctor = await User.create({
    firstname: firstname,
    lastname: lastname,
    email: email,
    number: number,
    age: age,
    gender: gender,
    password: password,
    type: "Doctor",
    doctorDepartment: doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  doctor
    ? res
        .status(200)
        .json({ success: true, message: "Doctor Added Successfully!", doctor })
    : res
        .status(400)
        .json({ success: false, message: "Something Went wrong!" });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found with this email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `http://192.168.1.103:5173/reset-forgot-password/${resetToken}`;

  const plainTextMessage = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

  const htmlMessage = `
    <!DOCTYPE html>
<html>

<head>
  <title>Password Reset</title>
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
      max-width: 600px;
      margin: 50px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
    }

    .header img {
      max-width: 150px;
    }

    .content {
      margin-top: 20px;
      color: #333;
      line-height: 1.6;
    }

    .button {
      display: inline-block;
      background-color: #1a73e8;
      color: #fff;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      margin-top: 20px;
      text-align: center;
      font-size: 16px;
      font-weight: 700;
      border: none;
      cursor: pointer;
    }

    .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #666;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <img src="https://res.cloudinary.com/dbhwmmzmi/image/upload/v1722318274/flh9i9v1o0zbqjtldwtz.png" alt="Company Logo">
    </div>
    <div class="content">
      <h1>Password Reset Request</h1>
      <p>Hello,</p>
      <p>You requested a password reset. Click the button below to reset your password:</p>
      <p style="text-align: center;">
      <a href="${resetUrl}">
        <button type="submit" class="button">Reset Password</button>
      </a>
      </p>
      <p>If you did not request this password reset, please ignore this email or contact support if you have questions.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 PsyCheck. All rights reserved.</p>
      <p>If you have any questions, please contact us at <a href="mailto:psycheck.notify@gmail.com">psycheck.notify@gmail.com</a></p>
    </div>
  </div>
</body>

</html>

  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      text: plainTextMessage,
      html: htmlMessage,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  // Hash URL token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token is invalid or has expired", 400)
    );
  } else {
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  // Set new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, "Password reset successfully", 200, res);
});

export const addNewQuestion = catchAsyncError(async (req, res, next) => {
  // Log the request body for debugging
  console.log("Request Body: ", req.body);

  const { text, options } = req.body;

  // Validate that the required fields are provided
  if (!text || !options) {
    return next(new ErrorHandler("Please provide a question and options.", 400));
  }

  // Check if the number of options is exactly 4
  if (options.length !== 4) {
    return next(new ErrorHandler("A question must have exactly four options.", 400));
  }

  // Validate each option's text based on the schema
  const validOptions = options.every(
    (option) =>
      typeof option.text === 'string' &&
      option.text.length >= 2 &&
      option.text.length <= 200
  );

  if (!validOptions) {
    return next(
      new ErrorHandler("Each option must have text between 2 and 200 characters.", 400)
    );
  }

  // Add the question to the database
  try {
    const question = await Question.create({
      text: text,
      options: options, // Assuming options match the optionSchema
    });

    res.status(201).json({
      success: true,
      message: "Question added successfully!",
      question,
    });
  } catch (error) {
    console.log(error); // Log error for debugging
    return next(new ErrorHandler("Failed to add question. Please try again.", 500));
  }
});



export const getAllQuestions = catchAsyncError(async (req, res, next) => {
  try {
    // Fetch all questions from the database
    const questions = await Question.find();

    // Return success response with all the questions
    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    return next(new ErrorHandler("Failed to retrieve questions. Please try again.", 500));
  }
});