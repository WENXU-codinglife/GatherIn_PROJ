import { Request, Response, NextFunction } from "express";

interface IAsynceFunction {
  (req: Request, res: Response, next: NextFunction): Promise<Response>;
}

const catchAsync = (fn: IAsynceFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default catchAsync;
