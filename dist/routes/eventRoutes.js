"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventController_1 = require("./../controllers/eventController");
const router = express_1.default.Router();
router.route("/event-stats").get(eventController_1.getEventStats);
router.route("/").get(eventController_1.getAllEvent).post(eventController_1.createEvent);
router.route("/:id").get(eventController_1.getEvent).patch(eventController_1.updateEvent).delete(eventController_1.deleteEvent);
exports.default = router;
