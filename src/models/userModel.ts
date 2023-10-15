import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: number;
  passwordResetToken: String;
  passwordResetExpires: Date;
}
export interface IUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: Date): boolean;
  createPasswordResetToken(): string;
}
type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
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
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    photo: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "creator", "organizer", "admin"],
      default: "user",
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
        validator: function (this: IUser, el: string) {
          return el === this.password;
        },
        message: "password is not confirmed correctly!",
      },
    },
    passwordChangedAt: {
      type: Number,
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  }
  //   {
  //     toJSON: { virtuals: true },
  //     toObject: { virtuals: true },
  //   }
);
userSchema.method(
  "correctPassword",
  async function correctPassword(
    candidatePassword: string,
    userPassword: string
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  }
);
userSchema.method(
  "changedPasswordAfter",
  function changedPasswordAfter(JWTTimestamp: number) {
    if (this.passwordChangedAt) {
      return JWTTimestamp < this.passwordChangedAt;
    }
  }
);
userSchema.method(
  "createPasswordResetToken",
  function createPasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  }
);

userSchema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) return next(); // for updating without changing passward
    // this.password = bcrypt.hash(this.password, 12); // sync version
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = "undefined";
    next();
  }
);

const User_Model = mongoose.model<IUser, UserModel>("User", userSchema);
export default User_Model;
