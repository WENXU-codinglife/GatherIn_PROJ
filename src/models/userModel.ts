import mongoose from "mongoose";
import validator from "validator";

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
    },
  }
  //   {
  //     toJSON: { virtuals: true },
  //     toObject: { virtuals: true },
  //   }
);
const User = mongoose.model("User", userSchema);
export default userSchema;
