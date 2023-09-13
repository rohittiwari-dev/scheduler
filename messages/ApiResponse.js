class ApiResponse {
    constructor(res, statusCode, message, data) {
        this.response(res, statusCode, message, data);
    }

    response(res, statusCode, message, data) {
        return res
            .status(statusCode)
            .json({error: false, success: false, status: statusCode, msg: message, data: data});
    }
}

export default ApiResponse;
