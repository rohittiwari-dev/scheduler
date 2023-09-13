// LocalImports
import ApiResponse from "../messages/ApiResponse.js";
import db from "../db/DBConnect.js";
import {EmptyRequiredData, NotFoundError, NotImplemented} from "../errors/CustomError.js";

export const handleListUser = async (req, res) => {
    const {page = 1, pageSize = 10} = req.query; // Default to page 1 and page size of 10
    const offset = (page - 1) * pageSize; // Calculate the offset

    const query = `
        SELECT ID, NAME, GIVEN_NAME, FAMILY_NAME, EMAIL, EMAIL_VERIFIED, TYPE, PROFESSION, 
        PROFESSIONAL_EXPERIENCE, CURRENT_DESIGNATION,PICTURE, TIMESTAMP
        FROM USER_TABLE
        LIMIT ? OFFSET ?`;
    const [rows, fields] = await db.promisePool.query(query, [parseInt(pageSize), offset]);

    const totalCountQuery = "SELECT COUNT(*) AS totalCount FROM USER_TABLE";
    const [totalCountResult] = await db.promisePool.query(totalCountQuery);
    const totalCount = totalCountResult[0].totalCount;

    if (rows.length) {
        const paginationInfo = {
            page: parseInt(page.toString()),
            pageSize: parseInt(pageSize.toString()),
            totalItems: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            users: rows
        };

        return new ApiResponse(
            res,
            200,
            "Users List Successfully Fetched",
            paginationInfo
        );
    } else {
        return new ApiResponse(res, 200, "No User Found", rows);
    }
};
export const handleDeleteUserById = async (req, res) => {
    const {id} = req.params;
    if (!id)
        throw new EmptyRequiredData("Id is Required in Params to Delete User");
    const query = "DELETE FROM USER_TABLE WHERE ID=?";
    const [rows, fields] = await db.promisePool.query(query, [id]);
    if (!rows.length)
        throw new NotImplemented("Something went wrong in deleting user..")
    new ApiResponse(
        res,
        200,
        "User Deleted Successfully..",
        rows
    );
};

export const handleGetUserById = async (req, res) => {
    const {id} = req.params;
    if (!id)
        throw new EmptyRequiredData("User Id is Required in Params to Fetch User");
    const query = "SELECT USER_TABLE.ID,USER_TABLE.NAME,USER_TABLE.EMAIL_VERIFIED,USER_TABLE.PROFESSION,USER_TABLE.CURRENT_DESIGNATION,USER_TABLE.PROFESSIONAL_EXPERIENCE,USER_TABLE.TIMESTAMP,USER_TABLE.PICTURE,USER_TABLE.EMAIL FROM USER_TABLE WHERE ID=?";
    const [rows, fields] = await db.promisePool.query(query, [id]);
    if (!rows[0])
        throw new NotFoundError("No User Found with this id..");
    new ApiResponse(res, 200, "Users List Successfully Fetched", rows[0]);
};

export const handleGetUserByEmail = async (req, res) => {
    const {email} = req.params;
    if (!email)
        throw new EmptyRequiredData("User email is Required in Params to Fetch User");
    const query = "SELECT USER_TABLE.ID,USER_TABLE.NAME,USER_TABLE.EMAIL_VERIFIED,USER_TABLE.PROFESSION,USER_TABLE.CURRENT_DESIGNATION,USER_TABLE.PROFESSIONAL_EXPERIENCE,USER_TABLE.TIMESTAMP,USER_TABLE.PICTURE,USER_TABLE.EMAIL FROM USER_TABLE WHERE EMAIL=?";
    const [rows, fields] = await db.promisePool.query(query, [email]);
    if (!rows[0])
        throw new NotFoundError("No User Found with this Email..");
    new ApiResponse(res, 200, "Users List Successfully Fetched", rows[0]);
};
