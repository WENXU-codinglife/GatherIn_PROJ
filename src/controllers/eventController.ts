import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
  query,
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
    const queryObj = { ...req.query };
    console.log(queryObj);
    const excludedFields = ["page", "sort", "limit", "fields"];
    if (queryObj) {
      excludedFields.forEach((el) => {
        delete queryObj[el];
      });
    }
    // Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let events_query = Event_Model.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const query_sort = req.query.sort as string;
      const sortBy = query_sort
        .split(",")
        .reduce((accumulator, currentValue) => {
          if (currentValue[0] !== "-") {
            accumulator = Object.assign(accumulator, { [currentValue]: 1 });
          } else {
            accumulator = Object.assign(accumulator, {
              [currentValue.slice(1)]: -1,
            });
          }
          console.log(accumulator);
          return accumulator;
        }, {});
      console.log(sortBy);
      events_query = events_query.sort(sortBy);
    } else {
      events_query = events_query.sort("createAt");
    }
    // Limiting
    if (req.query.fields) {
      const query_fields = req.query.fields as string;
      const fields = query_fields.split(",").join(" ");
      console.log(query_fields, fields);
      events_query.select(fields);
    } else {
      events_query.select("-__v");
    }

    const events = await events_query;
    return res.status(200).json({
      status: "success",
      results: events.length,
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
