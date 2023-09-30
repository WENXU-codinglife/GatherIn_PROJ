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
app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
