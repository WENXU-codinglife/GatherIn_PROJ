import express from "express";
import {
  getAllEvent,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  checkID,
  checkBody,
} from "./../controllers/eventController";
const router = express.Router();

router.param("id", checkID);

router.route("/").get(getAllEvent).post(checkBody, createEvent);
router.route("/:id").get(getEvent).patch(updateEvent).delete(deleteEvent);

export default router;
