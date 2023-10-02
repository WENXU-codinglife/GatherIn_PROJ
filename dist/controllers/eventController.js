"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvent = void 0;
const eventModel_1 = __importDefault(require("./../models/eventModel"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const getAllEvent = async (req, res, next) => {
    try {
        const features = new apiFeatures_1.default(eventModel_1.default.find(), req.query)
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
    catch (err) {
        return res.status(500).json({
            status: "fail",
            error: err,
        });
    }
};
exports.getAllEvent = getAllEvent;
const getEvent = async (req, res, next) => {
    try {
        const event = await eventModel_1.default.findById(req.params.id);
        // Event.Model.findOne({_id: req.params.id}) works as well
        return res.status(200).json({
            status: "success",
            data: { event },
        });
    }
    catch (err) {
        return res.status(404).json({ status: "fail", error: err });
    }
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
const updateEvent = async (req, res, next) => {
    try {
        const event = await eventModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }); // new means the delared event contains the update data
        return res.status(201).json({
            status: "success",
            data: { updatedEvent: event },
        });
    }
    catch (err) {
        return res.status(404).json({
            status: "fail",
            error: err,
        });
    }
};
exports.updateEvent = updateEvent;
const deleteEvent = async (req, res, next) => {
    try {
        await eventModel_1.default.findByIdAndDelete(req.params.id);
        return res.status(204).json({
            status: "success",
            message: "Successful Deletion!",
        });
    }
    catch (err) {
        return res.status(404).json({
            status: "fail",
            error: err,
        });
    }
};
exports.deleteEvent = deleteEvent;
