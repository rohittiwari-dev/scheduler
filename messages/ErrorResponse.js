class ErrorResponse {
    constructor(res, error, stack) {
        this.response(res, error, stack);
    }

    response(res, error, stack) {
        return res.status(error.statusCode || 500).json({
            error: true,
            success: false,
            status: error.statusCode || 500,
            msg: error.message,
            stack: process.env.SERVER_TYPE === "DEVELOPMENT" ? stack : undefined,
        });
    }
}

export default ErrorResponse;
