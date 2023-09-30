"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const eventSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "An event must have a name!"],
    },
    location: {
        type: String,
        require: false,
    },
    startingTime: Date,
    endingTime: Date,
    size: Number,
    charge: Number,
    organizer: {
        type: String,
        required: [true, "An event must have an organizer!"],
    },
    description: String,
    imageCover: {
        type: String,
        default: "https://default_img.jpeg",
    },
    images: {
        type: Array(String),
    },
});
const Event_Model = mongoose_1.default.model("Events", eventSchema);
exports.default = Event_Model;
