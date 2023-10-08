"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const appError_1 = __importDefault(require("./utils/appError"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const utils_1 = require("./utils/utils");
const errorController_1 = __importDefault(require("./controllers/errorController"));
const app = (0, express_1.default)();
// 1) middlewares
(0, utils_1.currentMode)("dev") && app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/../public`));
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// 2) routes
app.use("/api/v1/events", eventRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
app.all("*", (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl}.`, 404)); // once passing an argument to next(), Express will treat it as an error.
});
// Error-handling middleware
app.use(errorController_1.default);
exports.default = app;
