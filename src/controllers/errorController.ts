import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
const handleCastErrorDB = (err: mongoose.Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
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

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  let error = new AppError(err.message, statusCode);
  error.name = err.name;
  error.status = err instanceof AppError ? err.status : "error";
  if (process.env.NODE_ENV === "dev") {
    sendErrorDev(error, res);
  } else {
    if (err instanceof mongoose.Error.CastError) error = handleCastErrorDB(err);
    sendErrorProd(error, res);
  }
};

export default errorHandler;
