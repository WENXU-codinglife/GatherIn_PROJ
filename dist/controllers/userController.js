"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = require("../utils/appError");
exports.getAllUsers = (0, catchAsync_1.default)(async (req, res, next) => {
    const allUsers = await userModel_1.default.find();
    res.status(200).json({
        status: "success",
        result: allUsers.length,
        data: { allUsers },
    });
});
exports.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findByIdAndDelete(req.params.id);
    if (!user) {
        return next((0, appError_1.NotFoundError)());
    }
    return res.status(204).json({
        status: "success",
        message: "Successful Deletion!",
    });
});
