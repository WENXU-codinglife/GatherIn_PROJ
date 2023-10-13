import { Request, Response, NextFunction, RequestHandler } from "express";
import User_Model from "../models/userModel";
import catchAsync from "../utils/catchAsync";

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await User_Model.find();

    res.status(200).json({
      status: "success",
      result: allUsers.length,
      data: { allUsers },
    });
  }
);
