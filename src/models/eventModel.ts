import mongoose from "mongoose";
import validator from "validator";
interface IEvent extends mongoose.Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  location: string;
  startingTime: Date;
  endingTime: Date;
  createdAt: Date;
  size: number;
  maxGroupSize: number;
  charge?: number;
  organizer: string;
  description?: string;
  imageCover: string;
  images?: string[];
  isPrivate: boolean;
}

const eventSchema = new mongoose.Schema<IEvent>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "An event must have a name!"],
      maxLength: [
        40,
        "An event name must have less or equal than 40 characters",
      ],
      minLength: [
        5,
        "An event name must have greater or equal than 5 characters",
      ],
      // validate: [
      //   validator.isAlphanumeric,
      //   "Event names can only have letters and numbers!",
      // ],
    },
    location: {
      type: String,
      require: false,
    },
    startingTime: {
      type: Date,
      require: true,
      min: [Date.now(), "The event starting time should be in the future!"],
    },
    endingTime: { type: Date, require: true },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    size: {
      type: Number,
      default: 0,
      min: [0, "Size must be above 0!"],
      // validate: {
      //   validator: function (this: IEvent, size: number) {
      //     const q = this;

      //     console.log(q);
      //     console.log(this.get("name"));
      //     return size <= this.maxGroupSize;
      //   },
      //   message: (props) => `props ========> ${props.value}`,
      // },
    },
    charge: { type: Number, min: [0, "A charge must be above 0!"] },
    maxGroupSize: {
      type: Number,
      default: 0,
      min: [0, "Size must be above 0!"],
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
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

eventSchema.virtual("availablePositions").get(function (): number {
  return this.maxGroupSize - this.size;
});

const Event_Model = mongoose.model<IEvent>("Events", eventSchema);
export default Event_Model;
