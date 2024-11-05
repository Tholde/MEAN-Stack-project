export class ErrorResponse extends Error{
    public readonly statusCode: number;

    constructor(message:string, statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

// module.exports = ErrorResponse;