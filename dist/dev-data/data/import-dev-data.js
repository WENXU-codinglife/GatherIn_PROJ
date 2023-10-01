"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("./../../utils/utils");
const eventModel_1 = __importDefault(require("./../../models/eventModel"));
dotenv_1.default.config({ path: `${__dirname}/../../../conf.env` });
const DATA_LOCATIONS = {
    events: `${__dirname}/events-simple.json`,
};
const modelsToBeReloaded = ["events"];
if (!(0, utils_1.currentMode)("dev")) {
    console.log("No data importing for databases other than dev");
    console.log(process.env.NODE_ENV);
}
else {
    console.log("DB connected successfully!");
    const db = process.env.DATABASE_DEV.replace("<password>", process.env.DATABASE_PASSWORD);
    mongoose_1.default.connect(db).then((con) => {
        console.log("DB_dev connection successful!");
        try {
            deleteCurrentData(modelsToBeReloaded).then((res) => populateData(modelsToBeReloaded));
        }
        catch (err) {
            console.log(err);
        }
    });
}
const deleteCurrentData = async (models) => {
    try {
        if (models.includes("events")) {
            await eventModel_1.default.deleteMany();
            console.log("events deleted!");
        }
    }
    catch (err) {
        console.log(`ERROR: ${err}`);
    }
};
const populateData = async (models) => {
    try {
        if (models.includes("events")) {
            const events = JSON.parse(fs_1.default.readFileSync(DATA_LOCATIONS.events).toString());
            events.forEach(async (event) => {
                const newEvent = await eventModel_1.default.create(event);
                console.log("An Event added successfully!", newEvent.id);
            });
            console.log("All Event Data Added Successfully!");
        }
    }
    catch (err) {
        console.log(`ERROR: ${err}`);
    }
};
