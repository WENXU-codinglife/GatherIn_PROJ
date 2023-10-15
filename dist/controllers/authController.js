"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    // const newUser = await User_Model.create(req.body);
    const newUser = await userModel_1.default.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: Date.parse(req.body.passwordChangedAt) / 1000,
        role: req.body.role,
    });
    const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(201).json({
        status: "success",
        data: { user: newUser },
        token,
    });
});
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default("Please provide email and password!", 400));
    }
    const user = await userModel_1.default.findOne({ email: email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError_1.default("Incorrect email or password!", 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
    });
});
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    let token = "";
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        if (!token)
            return next(new appError_1.default("You are not logged in! Please log in to get access!", 401));
        const promisifiedVerify = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
        const decoded = await promisifiedVerify(token, process.env.JWT_SECRET);
        const currentUser = await userModel_1.default.findById(decoded.id);
        if (!currentUser)
            return next(new appError_1.default("The user belonging to this token do not exist", 401));
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new appError_1.default("User recently changed password! Please log in again!", 401));
        }
        req.user = currentUser; // I don't take this as a good practice
    }
    else {
        return next(new appError_1.default("You are not logged in! Please log in to get access!", 401));
    }
    next();
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return next(new appError_1.default("You do not have permission to perform this action!", 403));
        next();
    };
};
exports.restrictTo = restrictTo;
const forgotPassword = async (req, res, next) => {
    const user = await userModel_1.default.findOne({ email: req.body.email });
    if (!user)
        return next(new appError_1.default("There is no user with email address!", 404));
    const resetToken = user.createPasswordResetToken();
    await user.save();
};
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => { };
exports.resetPassword = resetPassword;
