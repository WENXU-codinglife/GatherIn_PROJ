import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "An event must have a name!"],
  },
  location: {
    type: String,
    require: false,
  },
  startingTime: Date,
  endingTime: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  size: Number,
  charge: Number,
  maxGroupSize: {
    type: Number,
    default: 0,
  },
  organizer: {
    type: String,
    required: [true, "An event must have an organizer!"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    default: "https://default_img.jpeg",
  },
  images: {
    type: Array(String),
  },
});

const Event_Model = mongoose.model("Events", eventSchema);
export default Event_Model;
