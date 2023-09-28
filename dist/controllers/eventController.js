"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvent = exports.checkBody = exports.checkID = void 0;
const fs_1 = __importDefault(require("fs"));
const events = JSON.parse(fs_1.default.readFileSync(`${__dirname}/../dev-data/data/events-simple.json`).toString());
const checkID = (req, res, next, val) => {
    const event = events.find((el) => el.id === +val);
    if (!event)
        return res.status(404).json({ status: "fail", message: "Invalid ID!" });
    next();
};
exports.checkID = checkID;
const checkBody = (req, res, next) => {
    const newEvent = req.body;
    if (!("name" in newEvent && "charge" in newEvent))
        return res.status(400).json({
            status: "fail",
            message: "Incorrect or missing info!",
        });
    next();
};
exports.checkBody = checkBody;
const getAllEvent = (req, res, next) => {
    res.status(200).json({
        status: "success",
        results: events.length,
        data: { events },
    });
};
exports.getAllEvent = getAllEvent;
const getEvent = (req, res, next) => {
    const id = +req.params.id;
    const event = events.find((el) => el.id === id);
    if (!event)
        return res.status(404).json({ status: "fail", message: "Invalid ID!" });
    res.status(200).json({
        status: "success",
        data: { event },
    });
};
exports.getEvent = getEvent;
const createEvent = (req, res, next) => {
    const newId = events[events.length - 1].id + 1;
    const newEvent = Object.assign({ id: newId }, req.body);
    events.push(newEvent);
    fs_1.default.writeFile(`${__dirname}/../dev-data/data/events-simple.json`, JSON.stringify(events), (err) => {
        res.status(201).json({
            status: "success",
            data: { events: newEvent },
        });
    });
};
exports.createEvent = createEvent;
const updateEvent = (req, res, next) => {
    const id = +req.params.id;
    const event = events.find((el) => el.id === id);
    Object.keys(req.body).forEach((key) => {
        if (key in event) {
            event[key] = req.body[key];
        }
    });
    const otherEvents = events.filter((el) => el.id !== id);
    const updatedEvents = otherEvents.concat([event]);
    fs_1.default.writeFile(`${__dirname}/dev-data/data/events-simple.json`, JSON.stringify(updatedEvents), (err) => {
        res.status(201).json({
            status: "success",
            data: { updatedEvent: event },
        });
    });
};
exports.updateEvent = updateEvent;
const deleteEvent = (req, res, next) => {
    const id = +req.params.id;
    const event = events.find((el) => el.id === id);
    // add deleting logic later
    res.status(204).json({
        status: "success",
        data: null,
    });
};
exports.deleteEvent = deleteEvent;
