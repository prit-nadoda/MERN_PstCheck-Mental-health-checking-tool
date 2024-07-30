import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import userRouter from "./router/userRouter.js";
import oauthRouter from "./router/oauthRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import { passportJwtStrategy } from "./utils/passportJwtStrategy.js";
import { passportConfig } from "./utils/passport.js";
import passport from "passport";
// import { passportConfig } from "./utils/passport.js";

config({ path: "./config/config.env" });
const app = express();

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL_USER,
      process.env.FRONTEND_URL_ADMIN,
      process.env.FRONTEND_IPV4_ADMIN,
      process.env.FRONTEND_IPV4_USER,
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(passport.initialize());

passportConfig();
passportJwtStrategy();

app.use("/api/v1", oauthRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

dbConnection();
app.use(errorMiddleware);

export default app;
