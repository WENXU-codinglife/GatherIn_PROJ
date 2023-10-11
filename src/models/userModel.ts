import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
}

const userSchema = new mongoose.Schema<IUser>(
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
    password: {
      type: String,
      required: [true, "A password is needed!"],
      minLength: [8, "A password must have greater or equal than 8 characters"],
    },
    passwordConfirm: {
      type: String,
      required: [true, "A confirmed password is needed!"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (this: IUser, el: string) {
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

const User_Model = mongoose.model("User", userSchema);
export default User_Model;
