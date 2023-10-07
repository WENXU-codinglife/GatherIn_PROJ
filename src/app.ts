import { ifError } from "assert";
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import morgan from "morgan";

import eventRouter from "./routes/eventRoutes";
import userRouter from "./routes/userRoutes";
import { currentMode } from "./utils/utils";

const app = express();

// 1) middlewares
currentMode("dev") && app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).requestTime = new Date().toISOString();
  next();
});

// 2) routes
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/users", userRouter);

interface IError extends Error {
  status: string;
  statusCode: number;
}

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Can't find ${req.originalUrl}.`);
  (err as any).status = "fail";
  (err as any).statusCode = 404;
  console.log(err);
  next(err); // once passing an argument to next(), Express will treat it as an error.
});

// Error-handling middleware
app.use((err: IError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.name;
  err.status = err.status || "error";
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;
