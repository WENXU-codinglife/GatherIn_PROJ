import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
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

const Event_Model = mongoose.model("Events", eventSchema);
export default Event_Model;
