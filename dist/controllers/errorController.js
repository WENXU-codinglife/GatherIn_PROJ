"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return new appError_1.default(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    /*
      when isOperantional is false, that means some problems happened not on users sides,
      but probably, unexpected ones on database(MongoDB), mongoose or somewhere else.
      So in this case, just send a generic error information to the clients
    */
    if (err.isOperational)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    else {
        console.error("ERROR💥", err);
        res.status(500).json({ status: "error", message: "Something went wrong!" });
    }
};
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof appError_1.default ? err.statusCode : 500;
    let error = new appError_1.default(err.message, statusCode);
    error.name = err.name;
    error.status = err instanceof appError_1.default ? err.status : "error";
    if (process.env.NODE_ENV === "dev") {
        sendErrorDev(error, res);
    }
    else {
        if (err instanceof mongoose_1.default.Error.CastError)
            error = handleCastErrorDB(err);
        if (err instanceof mongoose_1.default.Error.ValidationError)
            error = handleValidationErrorDB(err);
        sendErrorProd(error, res);
    }
};
exports.default = errorHandler;
