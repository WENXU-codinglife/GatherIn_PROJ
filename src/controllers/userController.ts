import { RequestHandler } from "express";

export const getAllUsers: RequestHandler = (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route hasn't been implemented!",
  });
};
