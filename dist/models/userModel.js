"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "A user must have a name!"],
        maxLength: [40, "A user name must have less or equal than 40 characters"],
        minLength: [
            5,
            "A user name must have greater or equal than 5 characters",
        ],
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, "A user must have an email!"],
        lowercase: true,
        validate: [validator_1.default.isEmail, "Please provide a valid email."],
    },
    photo: {
        type: String,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "A password is needed!"],
        minLength: [8, "A password must have greater or equal than 8 characters"],
    },
    passwordConfirm: {
        type: String,
        required: [true, "A confirmed password is needed!"],
    },
}
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
);
const User = mongoose_1.default.model("User", userSchema);
exports.default = userSchema;
