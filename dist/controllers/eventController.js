"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvent = void 0;
const eventModel_1 = __importDefault(require("./../models/eventModel"));
const getAllEvent = async (req, res, next) => {
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
        let events_query = eventModel_1.default.find(JSON.parse(queryStr));
        // Sorting
        if (req.query.sort) {
            const query_sort = req.query.sort;
            const sortBy = query_sort
                .split(",")
                .reduce((accumulator, currentValue) => {
                if (currentValue[0] !== "-") {
                    accumulator = Object.assign(accumulator, { [currentValue]: 1 });
                }
                else {
                    accumulator = Object.assign(accumulator, {
                        [currentValue.slice(1)]: -1,
                    });
                }
                console.log(accumulator);
                return accumulator;
            }, {});
            console.log(sortBy);
            events_query = events_query.sort(sortBy);
        }
        else {
            events_query = events_query.sort("createAt");
        }
        // Limiting
        if (req.query.fields) {
            const query_fields = req.query.fields;
            const fields = query_fields.split(",").join(" ");
            console.log(query_fields, fields);
            events_query.select(fields);
        }
        else {
            events_query.select("-__v");
        }
        const events = await events_query;
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
