import ErrorResponse from "../messages/ErrorResponse.js";

const GlobalErrorHandler = (error, req, res, next) => {
	process.env.SERVER_TYPE === "DEVELOPMENT"
		? new ErrorResponse(res, error, error.stack)
		: new ErrorResponse(res, error);
};

export default GlobalErrorHandler;
