import jwt from "jsonwebtoken";

class JWTActions {
    static createJW_token = (payload) => {
        return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "10d",
        });
    };

    static isJWTValid = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);
}

export default JWTActions;
