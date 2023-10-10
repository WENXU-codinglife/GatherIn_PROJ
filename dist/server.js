"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils/utils");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config({ path: `${__dirname}/../conf.env` });
const DATABASE_URI = (0, utils_1.currentMode)("dev")
    ? process.env.DATABASE_DEV
    : process.env.DATABASE;
const db = DATABASE_URI.replace("<password>", process.env.DATABASE_PASSWORD);
mongoose_1.default.connect(db).then((con) => {
    console.log("DB connection successful!");
});
const port = +process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
process.on("unhandledRejection", (err) => {
    console.log(err);
    server.close(() => {
        process.exit(1); // (second) in this way, the process will be terminated gracefully after other requests handled
    });
    // process.exit(1); // (first) 0 for success, 1 for uncalled exception. However, this is a brutal way to imediately shut down everything (ongoing requests, etc)
});
// each time that there is an unhandled rejection, the porcess will emit an object called unhandledRejection
// so we can subcribe to it
// this will handle all unhandled rejections
