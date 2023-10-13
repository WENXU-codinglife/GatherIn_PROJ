"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        select: false,
    },
    passwordConfirm: {
        type: String,
        select: false,
        required: [true, "A confirmed password is needed!"],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: "password is not confirmed correctly!",
        },
    },
}
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
);
userSchema.method("correctPassword", async function correctPassword(candidatePassword, userPassword) {
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next(); // for updating without changing passward
    // this.password = bcrypt.hash(this.password, 12); // sync version
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    this.passwordConfirm = "undefined";
    next();
});
const User_Model = mongoose_1.default.model("User", userSchema);
exports.default = User_Model;
