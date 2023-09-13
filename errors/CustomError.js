import {StatusCodes} from "http-status-codes";

export class CustomError extends Error {
    constructor(message) {
        super(message);
    }
}

export class NotFoundError extends CustomError {
    constructor(message) {
        super("NotFoundError : " + message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class AlreadyExists extends CustomError {
    constructor(message) {
        super("AlreadyExists : " + message);
        this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
    }
}

export class NotAllowed extends CustomError {
    constructor(message) {
        super("NotAllowed : " + message);
        this.statusCode = StatusCodes.METHOD_NOT_ALLOWED;
    }
}

export class EmptyRequiredData extends CustomError {
    constructor(message) {
        super("EmptyRequiredData : " + message);
        this.statusCode = StatusCodes.NOT_ACCEPTABLE;
    }
}

export class NotImplemented extends CustomError {
    constructor(message) {
        super("NotImplemented : " + message);
        this.statusCode = StatusCodes.NOT_IMPLEMENTED;
    }
}

export class BadRequest extends CustomError {
    constructor(message) {
        super("BadRequest : " + message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

export class Restricted extends CustomError {
    constructor(message) {
        super("Restricted : " + message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

export class Unauthorized extends CustomError {
    constructor(message) {
        super("Unauthorized : " + message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export class InternalServerError extends CustomError {
    constructor(message) {
        super("InternalServerError : " + message);
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

export default CustomError;
