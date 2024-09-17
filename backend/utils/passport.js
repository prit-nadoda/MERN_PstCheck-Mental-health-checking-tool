// utils/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/userSchema.js"; // Adjust the import path as needed
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";
import { generateToken, oAuthGenerateJwtToken } from "./jwkToken.js";

// Configure Cloudinary

const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists in our db
          let user = await User.findOne({
            email: profile.emails[0].value,
          });

          if (!user) {
            // Upload avatar to Cloudinary
            const lastSixDigitsID = profile.id.substring(profile.id.length - 6);
            const lastTwoDigitsName = profile._json.name.substring(
              profile._json.name.length - 2
            );
            const newPass = lastTwoDigitsName + lastSixDigitsID;
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(newPass, salt);
            const avatarUploadResponse = await cloudinary.v2.uploader.upload(
              profile._json.picture
            );

            // Create a new user in our db
            user = await User.create({
              googleId: profile.id,
              fullname: profile.displayName,
              email: profile.emails[0].value,
              userAvatar: {
                public_id: avatarUploadResponse.public_id,
                url: avatarUploadResponse.secure_url,
              },
              password: hashedPassword,
              isVerified: true
     
            });
          }

          // Return the user object
          const patientToken = oAuthGenerateJwtToken(user);
          done(null, { user, patientToken });
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
};

export { passportConfig };
