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

export default app;
