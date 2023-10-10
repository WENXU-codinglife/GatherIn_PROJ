class AppError extends Error {
  statusCode: number;
  status: "fail" | "error";
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); // taking care of error stack
  }
}

export const NotFoundError = () => {
  return new AppError(" No data found with the identifier!", 404);
};

export default AppError;
