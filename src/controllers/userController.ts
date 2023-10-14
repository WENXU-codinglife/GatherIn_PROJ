import { Request, Response, NextFunction, RequestHandler } from "express";
import User_Model from "../models/userModel";
import catchAsync from "../utils/catchAsync";
import { NotFoundError } from "../utils/appError";

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

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User_Model.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(NotFoundError());
    }
    return res.status(204).json({
      status: "success",
      message: "Successful Deletion!",
    });
  }
);
