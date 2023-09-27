"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const app = (0, express_1.default)();
// 1) middlewares
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});
// 2) routes
app.use("/api/v1/events", eventRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
// 3) start server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
