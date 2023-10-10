import { Request, Response, RequestHandler, NextFunction } from "express";
import Event_Model from "./../models/eventModel";
import APIFeatures from "../utils/apiFeatures";
import catchAsync from "../utils/catchAsync";
import AppError, { NotFoundError } from "../utils/appError";

export const getAllEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Event_Model.find(), req.query)
      .filter()
      .sort()
      .limit()
      .paginate();
    const events = await features.query;
    return res.status(200).json({
      status: "success",
      results: events.length,
      data: { events },
    });
  }
);

export const getEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event_Model.findById(req.params.id);
    // Event.Model.findOne({_id: req.params.id}) works as well
    if (!event) {
      return next(NotFoundError());
    }
    return res.status(200).json({
      status: "success",
      data: { event },
    });
  }
);

export const createEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newEvent = await Event_Model.create(req.body as Event);
    return res.status(201).json({
      status: "success",
      data: { events: newEvent },
    });
  }
);

export const updateEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event_Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); // new means the delared event contains the update data
    if (!event) {
      return next(NotFoundError());
    }
    return res.status(201).json({
      status: "success",
      data: { updatedEvent: event },
    });
  }
);
export const deleteEvent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = await Event_Model.findByIdAndDelete(req.params.id);
    if (!event) {
      return next(NotFoundError());
    }
    return res.status(204).json({
      status: "success",
      message: "Successful Deletion!",
    });
  }
);

export const getEventStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const stats = await Event_Model.aggregate([
      { $match: { charge: { $gte: 20 } } },
      {
        $group: {
          _id: null,
          num: { $sum: 1 },
          avgCharge: { $avg: "$charge" },
          minSize: { $min: "$size" },
          maxSize: { $max: "$size" },
        },
      },
    ]);
    return res.status(200).json({
      status: "success",
      data: { stats },
    });
  }
);
