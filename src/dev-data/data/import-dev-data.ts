import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { currentMode } from "./../../utils/utils";
import Event_Model from "./../../models/eventModel";
dotenv.config({ path: `${__dirname}/../../../conf.env` });

const DATA_LOCATIONS = {
  events: `${__dirname}/events-simple.json`,
};
const modelsToBeReloaded = ["events"];

if (!currentMode("dev")) {
  console.log("No data importing for databases other than dev");
  console.log(process.env.NODE_ENV);
} else {
  console.log("DB connected successfully!");
  const db = process.env.DATABASE_DEV!.replace(
    "<password>",
    process.env.DATABASE_PASSWORD!
  );
  mongoose.connect(db).then((con) => {
    console.log("DB_dev connection successful!");
    try {
      deleteCurrentData(modelsToBeReloaded).then((res) =>
        populateData(modelsToBeReloaded)
      );
    } catch (err) {
      console.log(err);
    }
  });
}

const deleteCurrentData = async (models: string[]) => {
  try {
    if (models.includes("events")) {
      await Event_Model.deleteMany();
      console.log("events deleted!");
    }
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};
const populateData = async (models: string[]) => {
  try {
    if (models.includes("events")) {
      const events: Object[] = JSON.parse(
        fs.readFileSync(DATA_LOCATIONS.events).toString()
      );
      events.forEach(async (event) => {
        const newEvent = await Event_Model.create(event);
        console.log("An Event added successfully!", newEvent.id);
      });
      console.log("All Event Data Added Successfully!");
    }
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
};
