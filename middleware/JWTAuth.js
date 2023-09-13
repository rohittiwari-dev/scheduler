import * as APIError from "../errors/CustomError.js";
import JWTActions from "../utils/JWTActions.js";

const JWTAuth = (req, res, next) => {
	const { usr_utr } = req.cookies;
	if (!usr_utr) {
		throw new APIError.Unauthorized("You are Not logged in or Authorized User");
	}

	const payload = JWTActions.isJWTValid(usr_utr);
	if (!payload) {
		throw new APIError.Unauthorized("You are Not logged in or Authorized User");
	}
	req.user = payload;
	req.token = usr_utr;
	next();
};

export default JWTAuth;
