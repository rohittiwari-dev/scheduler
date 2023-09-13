import auth from "basic-auth";
import * as APIError from "../errors/CustomError.js";
import CatchAsyncError from "../utils/CatchAsyncError.js";

const ProtectRoutes = CatchAsyncError(async (req, res, next) => {
    const user = await auth(req);
    if (!user) throw new APIError.Restricted("Not allowed to access this route");

    const username = process.env.API_USERNAME;
    const password = process.env.API_PASSWORD;

    if (!user.name || !user.pass)
        throw new APIError.Restricted("Not allowed to access this route");

    if (
        user &&
        user.name === username &&
        user.pass === password
    ) {
        next();
    } else
        throw new APIError.Unauthorized(
            "Invalid Credentials! Not Allowed to access this Routes.."
        );
});

export default ProtectRoutes;
