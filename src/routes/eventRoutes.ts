import express from "express";
import { protect } from "../controllers/authController";
import {
  getAllEvent,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
} from "./../controllers/eventController";
const router = express.Router();

router.route("/event-stats").get(getEventStats);
router.route("/").get(protect, getAllEvent).post(createEvent);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;
