import { ifError } from "assert";
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import morgan from "morgan";

import AppError from "./utils/appError";
import eventRouter from "./routes/eventRoutes";
import userRouter from "./routes/userRoutes";
import { currentMode } from "./utils/utils";
import errorHandler from "./controllers/errorController";

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

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl}.`, 404)); // once passing an argument to next(), Express will treat it as an error.
});

// Error-handling middleware
app.use(errorHandler);

export default app;
