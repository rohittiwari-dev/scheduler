/* Imports */
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import bodyParser from "body-parser";
import passport from "passport";
import cookieSession from "cookie-session";
/* Local Import */
import GlobalErrorHandler from "./middleware/GlobalErrorHandler.js";
import JWTActions from "./utils/JWTActions.js";
import CatchAsyncError from "./utils/CatchAsyncError.js";
import {NotAllowed, Unauthorized} from "./errors/CustomError.js";
import ApiResponse from "./messages/ApiResponse.js";
import userRoute from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import "./utils/passport.js";
import serviceRoute from "./routes/serviceRoute.js";
import appointmentRoute from "./routes/appointmentRoute.js";

/* Express App Configuration and Middleware*/
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(
    cookieSession({
         name: "session",
         keys: ["getmetharapy"], 
         maxAge: 24 * 60 * 60 * 1000, 
         credentials: true,
         sameSite: "none",
         secure: process.env.NODE_ENV === "PRODUCTION"
    })
);
app.use(
    cors({
        origin: ["http://localhost:5173" , "https://scheduler-frontend-mdvv.onrender.com" , "http://localhost:4173"],
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());

/* PORT Variable */
const PORT = process.env.PORT || 5000;

/* Routes Middleware */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/service", serviceRoute);
app.use("/api/v1/appointment", appointmentRoute);
/*Open Routes*/

/* Main Routes */
app.get(
    "/",
    CatchAsyncError(async (req, res) => {
        const {username, password} = req.body;
        if (!username || !password)
            throw new Unauthorized("You are not Authorised access this route..");

        if (username !== "Rohit" && password !== "Rohit")
            throw new NotAllowed("You are Allowed to access this route");

        const tokens = JWTActions.createJW_token({username, password});
        res.cookie("usr_utr", tokens, {
            httpOnly: true,
            sameSite: true,
            path: "/",
            secure: false,
            expires: new Date(Date.now() + 86400000),
        });
        new ApiResponse(res, 200, "Successfully Logged in to Backend", true, {
            username,
            password,
            tokens,
        });
    })
);
app.all("*", (req, res, next) => {
    const err = new Error(`Requested URL : ${req.path} Not Found `);
    err.statusCode = 404;
    next(err);
});

/* MAIN ERROR HANDLER MIDDLEWARE */
app.use(GlobalErrorHandler);

/* Server */
app.listen(PORT, (err) => {
    if (err) console.error(err);
    else console.log("Server started at ", PORT);
});
