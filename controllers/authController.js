import db from "../db/DBConnect.js";
import {Restricted} from "../errors/CustomError.js";
import ApiResponse from "../messages/ApiResponse.js";

export const handleLoginSuccess = async (req, res) => {
    if (req.user) {
        let user = req.user;
        const [rows, fields] = await db.promisePool.query(
            "SELECT ID,NAME,GIVEN_NAME,FAMILY_NAME,PICTURE,EMAIL,EMAIL_VERIFIED,TYPE,PROFESSION,PROFESSIONAL_EXPERIENCE,CURRENT_DESIGNATION,TIMESTAMP FROM USER_TABLE WHERE ID=?",
            [user.id]
        );
        new ApiResponse(res, 200, "Successfully Logged In", rows[0]);
    } else {
        throw new Restricted("Not Authorised");
    }
};
