import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwkToken.js";
import cloudinary from "cloudinary";
import crypto from "crypto";
import { sendEmail } from "../utils/emailService.js";

export const patientRegister = catchAsyncError(async (req, res, next) => {
  const {
    fullname,
    email,
    number,
    password,
    type,
    // doctorDepartment,
    // docAvatar,
  } = req.body;
  if (!fullname || !email || !number || !password || !type) {
    return next(new ErrorHandler("Please fill all the fields!", 400));
  }

  let isUserExist = await User.findOne({ email });
  if (isUserExist) {
    return next(
      new ErrorHandler(
        "User already Registrated with given Email Address!",
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
    // doctorDepartment: doctorDepartment,
    // docAvatar: docAvatar,
  });
  generateToken(user, "patient registered successfully!", 200, res);
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
        <style>
            .container {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .link {
                color: #1a73e8;
                text-decoration: none;
            }
            .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p>Your password reset token is as follows:</p>
            <p>
                <a href="${resetUrl}" class="link">
                    Reset Password
                </a>
            </p>
            <p class="footer">
                If you have not requested this email, then ignore it.
            </p>
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
