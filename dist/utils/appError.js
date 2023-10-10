"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor); // taking care of error stack
    }
}
const NotFoundError = () => {
    return new AppError(" No data found with the identifier!", 404);
};
exports.NotFoundError = NotFoundError;
exports.default = AppError;
