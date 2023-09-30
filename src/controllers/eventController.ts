import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import fs from "fs";
import Event_Model from "./../models/eventModel";

interface Event {
  id: number;
  name: string;
  location: string;
  startingTime: string;
  endingTime: string;
  size: number;
  charge: number;
  organizer: string;
  description: string;
  imageCover: string;
  images: string[];
}

export const getAllEvent: RequestHandler = async (req, res, next) => {
  try {
    const events = await Event_Model.find();
    return res.status(200).json({
      status: "success",
      data: { events },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      error: err,
    });
  }
};

export const getEvent: RequestHandler = async (req, res, next) => {
  try {
    const event = await Event_Model.findById(req.params.id);
    // Event.Model.findOne({_id: req.params.id}) works as well
    return res.status(200).json({
      status: "success",
      data: { event },
    });
  } catch (err) {
    return res.status(404).json({ status: "fail", error: err });
  }
};

export const createEvent: RequestHandler = async (req, res, next) => {
  try {
    const newEvent = await Event_Model.create(req.body as Event);
    return res.status(201).json({
      status: "success",
      data: { events: newEvent },
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Error: Invalid Data!",
      error: err,
    });
  }
};

export const updateEvent: RequestHandler = async (req, res, next) => {
  try {
    const event = await Event_Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }); // new means the delared event contains the update data
    return res.status(201).json({
      status: "success",
      data: { updatedEvent: event },
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      error: err,
    });
  }
};
export const deleteEvent: RequestHandler = async (req, res, next) => {
  try {
    await Event_Model.findByIdAndDelete(req.params.id);
    return res.status(204).json({
      status: "success",
      message: "Successful Deletion!",
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      error: err,
    });
  }
};
