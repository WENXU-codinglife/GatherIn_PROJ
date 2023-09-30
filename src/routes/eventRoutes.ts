import express from "express";
import {
  getAllEvent,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
} from "./../controllers/eventController";
const router = express.Router();

router.route("/").get(getAllEvent).post(createEvent);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;
