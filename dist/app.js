"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const utils_1 = require("./utils/utils");
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
    const err = new Error(`Can't find ${req.originalUrl}.`);
    err.status = "fail";
    err.statusCode = 404;
    console.log(err);
    next(err); // once passing an argument to next(), Express will treat it as an error.
});
// Error-handling middleware
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.name;
    err.status = err.status || "error";
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});
exports.default = app;
