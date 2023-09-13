import {Router} from "express";
import passport from "passport";
import {Unauthorized} from "../errors/CustomError.js";
import CatchAsyncError from "../utils/CatchAsyncError.js";
import {handleLoginSuccess} from "../controllers/authController.js";

const authRouter = Router();

authRouter.get("/login/success", CatchAsyncError(handleLoginSuccess));

authRouter.get("/login/failed", (req, res) => {
    throw new Unauthorized("Login Failed, Login Again !");
});

authRouter.get(
    "/google",
    passport.authenticate(
        "google",
        ["openid", "profile", "email", "https://www.googleapis.com/auth/calendar"],
        {
            accessType: "offline",
            include_granted_scopes: true,
        }
    )
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        accessType: "offline",
        successRedirect:
            process.env.SERVER_TYPE === "DEVELOPMENT"
                ? process.env.CLIENT_URL
                : process.env.CLIENT_URL2,
        failureRedirect: "/api/v1/auth/login/failed",
        include_granted_scopes: true,
    }),
    (req, res) => {
        const user = req.user;
        const {code} = req.query;
        res.status(200).json({user, code});
    }
);

authRouter.get("/logout", (req, res) => {
    req.logout();
    if (process.env.SERVER_TYPE === "DEVELOPMENT") {
        res.redirect(process.env.CLIENT_URL);
    } else ;
    res.redirect(process.env.CLIENT_URL2);
});

export default authRouter;
