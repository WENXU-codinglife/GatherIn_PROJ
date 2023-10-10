import mongoose from "mongoose";
import dotenv from "dotenv";
import { currentMode } from "./utils/utils";
import app from "./app";

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception! Shutting down...\n", err.name, err.message);
  process.exit(1);
});
dotenv.config({ path: `${__dirname}/../conf.env` });

const DATABASE_URI = currentMode("dev")
  ? process.env.DATABASE_DEV!
  : process.env.DATABASE!;
const db = DATABASE_URI.replace("<password>", process.env.DATABASE_PASSWORD!);

mongoose.connect(db).then((con) => {
  console.log("DB connection successful!");
});

const port: number = +process.env.PORT! || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! Shutting down...\n", err);
  server.close(() => {
    process.exit(1); // (second) in this way, the process will be terminated gracefully after other requests handled
  });
  // process.exit(1); // (first) 0 for success, 1 for uncalled exception. However, this is a brutal way to imediately shut down everything (ongoing requests, etc)
});
// each time that there is an unhandled rejection, the porcess will emit an object called unhandledRejection
// so we can subcribe to it
// this will handle all unhandled rejections
