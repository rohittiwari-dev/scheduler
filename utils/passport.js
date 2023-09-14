import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import db from "../db/DBConnect.js";

passport.use(
	new Strategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.BASE_URL + "/api/v1/auth/google/callback",
			scope: [
				"openid",
				"profile",
				"email",
				"https://www.googleapis.com/auth/calendar",
			],
		},
		async function (accessToken, refreshToken, profile, cb) {
			try {
				const userInfo = profile._json;
				const [rows, fields] = await db.promisePool.query(
					"SELECT * FROM USER_TABLE WHERE ID=" + userInfo.sub
				);

				if (Object.keys(rows[0] || {}).length) {
					if (refreshToken) {
						await db.promisePool.query(
							`UPDATE USER_TABLE SET REFRESH_TOKEN='${refreshToken}' WHERE ID='${rows[0].ID}'`
						);
					}
					if (accessToken) {
						await db.promisePool.query(
							`UPDATE USER_TABLE SET ACCESS_TOKEN='${accessToken}' WHERE ID='${rows[0].ID}'`
						);
					}
				} else {
					const query = `INSERT INTO USER_TABLE (ID,NAME,GIVEN_NAME,FAMILY_NAME,EMAIL,PICTURE,TYPE,EMAIL_VERIFIED,REFRESH_TOKEN,ACCESS_TOKEN) VALUES ('${userInfo.sub}','${userInfo.name}','${userInfo.given_name}','${userInfo.family_name}','${userInfo.email}','${userInfo.picture}','consultant',${userInfo.email_verified},'${refreshToken}','${accessToken}')`;
					const [rows, fields] = await db.promisePool.query(query);
				}
			} catch (err) {
				console.log(err);
			}
			cb(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
