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

export const getAllEvent: RequestHandler = (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
};

export const getEvent: RequestHandler = (req, res, next) => {
  return;
  // const id: number = +req.params.id;
  // const event = events.find((el) => el.id === id);
  // if (!event)
  //   return res.status(404).json({ status: "fail", message: "Invalid ID!" });
  // res.status(200).json({
  //   status: "success",
  //   data: { event },
  // });
};

export const createEvent: RequestHandler = async (req, res, next) => {
  try {
    const newEvent = await Event_Model.create(req.body);
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

export const updateEvent: RequestHandler = (req, res, next) => {
  return;
  // const id: number = +req.params.id;
  // const event = events.find((el) => el.id === id);
  // Object.keys(req.body).forEach((key) => {
  //   if (key in event!) {
  //     (event as any)[key] = req.body[key];
  //   }
  // });
  // const otherEvents = events.filter((el) => el.id !== id);
  // const updatedEvents = otherEvents.concat([event!]);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/events-simple.json`,
  //   JSON.stringify(updatedEvents),
  //   (err) => {
  //     res.status(201).json({
  //       status: "success",
  //       data: { updatedEvent: event },
  //     });
  //   }
  // );
};

export const deleteEvent: RequestHandler = (req, res, next) => {
  return;
  // const id: number = +req.params.id;
  // const event = events.find((el) => el.id === id);
  // // add deleting logic later
  // res.status(204).json({
  //   status: "success",
  //   data: null,
  // });
};
