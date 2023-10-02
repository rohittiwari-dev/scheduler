// LocalImports
import ApiResponse from "../messages/ApiResponse.js";
import {EmptyRequiredData, NotFoundError, NotImplemented, Restricted} from "../errors/CustomError.js";
import db from "../db/DBConnect.js";

export const handleListService = async (req, res) => {

    const {page, pageSize} = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(pageSize) || 10;

    const offset = (currentPage - 1) * itemsPerPage;

    const query = `SELECT * FROM SERVICE_TABLE LIMIT ?, ?`;
    const queryParams = [offset, itemsPerPage];

    const countQuery = `SELECT COUNT(*) AS total FROM SERVICE_TABLE`;

    const [rows, fields] = await db.promisePool.query(query, queryParams);
    const [countRows] = await db.promisePool.query(countQuery);

    const totalRows = countRows[0].total;

    const totalPages = Math.ceil(totalRows / itemsPerPage);

    const response = {
        page: currentPage,
        pageSize: itemsPerPage,
        totalPages: totalPages,
        totalItems: totalRows,
        services: rows,
    };

    new ApiResponse(res, 200, "Successfully Fetched all Service..", response);

};


export const handleListServiceByLoginUser = async (req, res) => {
    const user = req.user
    if (!user) {
        throw new Restricted("This Route is Restricted")
    }
    const {page, pageSize} = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(pageSize) || 10;

    const offset = (currentPage - 1) * itemsPerPage;

    const query = `SELECT * FROM SERVICE_TABLE WHERE HOST_EMAIL=? LIMIT ?, ?`;
    const queryParams = [user._json.email, offset, itemsPerPage];

    const countQuery = `SELECT COUNT(*) AS total FROM SERVICE_TABLE WHERE HOST_EMAIL=?`;

    const [rows, fields] = await db.promisePool.query(query, queryParams);
    const [countRows] = await db.promisePool.query(countQuery, [user._json.email]);

    const totalRows = countRows[0].total;

    const totalPages = Math.ceil(totalRows / itemsPerPage);

    const response = {
        page: currentPage,
        pageSize: itemsPerPage,
        totalPages: totalPages,
        totalItems: totalRows,
        services: rows,
    };

    new ApiResponse(res, 200, "Successfully Fetched Service List by Logged in User", response);

};

export const handleListServiceByEmail = async (req, res) => {
    const {email} = req.params
    if (!email) {
        throw new Restricted("Email is Required...")
    }
    const {page, pageSize} = req.query;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(pageSize) || 10;

    const offset = (currentPage - 1) * itemsPerPage;

    const query = `SELECT * FROM SERVICE_TABLE  WHERE HOST_EMAIL=?  LIMIT ?, ?`;
    const queryParams = [email, offset, itemsPerPage];

    const countQuery = `SELECT COUNT(*) AS total FROM SERVICE_TABLE WHERE HOST_EMAIL=?`;

    const [rows, fields] = await db.promisePool.query(query, queryParams);
    const [countRows] = await db.promisePool.query(countQuery, [email]);


    const totalRows = countRows[0].total;

    const totalPages = Math.ceil(totalRows / itemsPerPage);

    const response = {
        page: currentPage,
        pageSize: itemsPerPage,
        totalPages: totalPages,
        totalItems: totalRows,
        services: rows,
    };
    if (!rows.length) new ApiResponse(res, 200, "No Service Info Found With this Email..", response);
    else new ApiResponse(res, 200, "Successfully Fetched Service List by Email", response);

};


export const handleCreateService = async (req, res) => {
    if (!req.user) {
        throw new Restricted("This Route is Restricted")
    }
    const {
        service_type,
        service_name,
        service_duration,
        service_location,
        availability,
        price_per_hour,
        host_email
    } = req.body;
    if (!service_name || !service_type || !host_email) {
        throw new EmptyRequiredData("Some Required Information not Provided...")
    }

    let mysqlQuery;
    let queryParams;

	mysqlQuery = `INSERT INTO SERVICE_TABLE (SERVICE_TYPE, SERVICE_NAME, SERVICE_DURATION, SERVICE_LOCATION, AVAILABILITY, PRICE_PER_HOUR, HOST_EMAIL) VALUES (?, ?, ?, ?, ?, ?, ?)`;
	queryParams = [
		service_type,
		service_name,
		service_duration || "00:30:00",
		service_location || "Google Meet",
		availability,
		price_per_hour || "0",
		host_email,
	];

    const [rows, fields] = await db.promisePool.query(mysqlQuery, queryParams);
    new ApiResponse(res, 201, "Successfully Service Created", rows);

};

export const handleGetServiceWithServiceId = async (req, res) => {
    const {serviceId} = req.params
    if (!serviceId)
        throw new EmptyRequiredData("Service ID Must Be there in path Params..")

    const query = `SELECT * FROM SERVICE_TABLE CROSS JOIN USER_TABLE WHERE SERVICE_TABLE.ID=?`

    const [rows, fields] = await db.promisePool.query(query, [serviceId])

    if (!rows[0]) throw new NotFoundError("No Service and Linked user Found With this Service Id..")

    new ApiResponse(res, 200, "Successfully Fetched service information..", rows[0])
}

export const handleDeleteServiceByServiceId = async (req, res) => {
    const {service_id} = req.params
    if (!service_id) throw new EmptyRequiredData("Service Id is Required...")
    const query = `DELETE FROM SERVICE_TABLE WHERE ID=?`
    const [rows, fiels] = await db.promisePool.query(query, [service_id]);
    if (rows.affectedRows <= 0) throw new NotImplemented("Something Went wrong in delete Service..")
    new ApiResponse(res, 200, "Successfully Delete Service...", rows)
}
