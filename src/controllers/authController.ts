import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import User_Model from "./../models/userModel";

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User_Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  }
);
