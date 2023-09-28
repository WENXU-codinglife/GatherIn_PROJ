import mongoose from "mongoose";
import dotenv from "dotenv";
import { currentMode } from "./utils/utils";
import app from "./app";

dotenv.config({ path: `${__dirname}/../config.env` });

const DATABASE_URI = currentMode("dev")
  ? process.env.DATABASE_DEV!
  : process.env.DATABASE!;
const db = DATABASE_URI.replace("<password>", process.env.DATABASE_PASSWORD!);

mongoose.connect(db).then((con) => {
  console.log("DB connection successful!");
});

const port: number = +process.env.PORT! || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
