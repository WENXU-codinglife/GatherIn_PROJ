"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvent = void 0;
const eventModel_1 = __importDefault(require("./../models/eventModel"));
const getAllEvent = (req, res, next) => {
    res.status(200).json({
        status: "success",
    });
};
exports.getAllEvent = getAllEvent;
const getEvent = (req, res, next) => {
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
exports.getEvent = getEvent;
const createEvent = async (req, res, next) => {
    try {
        const newEvent = await eventModel_1.default.create(req.body);
        return res.status(201).json({
            status: "success",
            data: { events: newEvent },
        });
    }
    catch (err) {
        return res.status(400).json({
            status: "fail",
            message: "Error: Invalid Data!",
            error: err,
        });
    }
};
exports.createEvent = createEvent;
const updateEvent = (req, res, next) => {
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
exports.updateEvent = updateEvent;
const deleteEvent = (req, res, next) => {
    return;
    // const id: number = +req.params.id;
    // const event = events.find((el) => el.id === id);
    // // add deleting logic later
    // res.status(204).json({
    //   status: "success",
    //   data: null,
    // });
};
exports.deleteEvent = deleteEvent;
