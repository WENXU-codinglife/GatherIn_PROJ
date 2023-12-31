import { promisify } from "util";
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import User_Model, { IUser, IUserMethods } from "./../models/userModel";
import sendEmail from "../utils/email";

interface IUserRequest extends Request {
  user:
    | mongoose.Document<unknown, {}, IUser> &
        Omit<
          IUser &
            Required<{
              _id: mongoose.Schema.Types.ObjectId;
            }>,
          keyof IUserMethods
        > &
        IUserMethods;
}

const signToken = (id: mongoose.Schema.Types.ObjectId) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const newUser = await User_Model.create(req.body);
    const newUser = await User_Model.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: Date.parse(req.body.passwordChangedAt) / 1000,
      role: req.body.role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN!,
    });
    res.status(201).json({
      status: "success",
      data: { user: newUser },
      token,
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    const user = await User_Model.findOne({ email: email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password!", 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: "success",
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      if (!token)
        return next(
          new AppError(
            "You are not logged in! Please log in to get access!",
            401
          )
        );
      const promisifiedVerify = promisify<string, jwt.Secret>(jwt.verify);
      const decoded = await promisifiedVerify(token, process.env.JWT_SECRET!);
      const currentUser = await User_Model.findById((decoded as any).id);
      if (!currentUser)
        return next(
          new AppError("The user belonging to this token do not exist", 401)
        );
      if (currentUser.changedPasswordAfter((decoded as any).iat)) {
        return next(
          new AppError(
            "User recently changed password! Please log in again!",
            401
          )
        );
      }
      (req as IUserRequest).user = currentUser; // I don't take this as a good practice
    } else {
      return next(
        new AppError("You are not logged in! Please log in to get access!", 401)
      );
    }
    next();
  }
);

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes((req as IUserRequest).user.role))
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    next();
  };
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await User_Model.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with email address!", 404));
  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

export const resetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
