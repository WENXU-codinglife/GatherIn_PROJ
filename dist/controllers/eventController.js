"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEventStats = exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvent = exports.getAllEvent = void 0;
const eventModel_1 = __importDefault(require("./../models/eventModel"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.getAllEvent = (0, catchAsync_1.default)(async (req, res, next) => {
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
});
exports.getEvent = (0, catchAsync_1.default)(async (req, res, next) => {
    const event = await eventModel_1.default.findById(req.params.id);
    // Event.Model.findOne({_id: req.params.id}) works as well
    return res.status(200).json({
        status: "success",
        data: { event },
    });
});
exports.createEvent = (0, catchAsync_1.default)(async (req, res, next) => {
    const newEvent = await eventModel_1.default.create(req.body);
    return res.status(201).json({
        status: "success",
        data: { events: newEvent },
    });
});
exports.updateEvent = (0, catchAsync_1.default)(async (req, res, next) => {
    const event = await eventModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    }); // new means the delared event contains the update data
    return res.status(201).json({
        status: "success",
        data: { updatedEvent: event },
    });
});
exports.deleteEvent = (0, catchAsync_1.default)(async (req, res, next) => {
    await eventModel_1.default.findByIdAndDelete(req.params.id);
    return res.status(204).json({
        status: "success",
        message: "Successful Deletion!",
    });
});
exports.getEventStats = (0, catchAsync_1.default)(async (req, res, next) => {
    const stats = await eventModel_1.default.aggregate([
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
});
