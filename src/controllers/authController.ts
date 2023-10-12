import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import User_Model from "./../models/userModel";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const newUser = await User_Model.create(req.body);
    const newUser = await User_Model.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
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
