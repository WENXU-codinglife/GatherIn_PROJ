import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import fs from "fs";

interface Event {
  id: number;
  name: string;
  location: string;
  startingTime: string;
  endingTime: string;
  size: number;
  charge: number;
  organizer: string;
  description: string;
  imageCover: string;
  images: string[];
}

const app = express();
app.use(express.json());

const events: Event[] = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/events-simple.json`).toString()
);

const getAllEvent: RequestHandler = (req, res, next) => {
  res.status(200).json({
    status: "success",
    results: events.length,
    data: { events },
  });
};

const getEvent: RequestHandler = (req, res, next) => {
  const id: number = +req.params.id;
  const event = events.find((el) => el.id === id);
  if (!event)
    return res.status(404).json({ status: "fail", message: "Invalid ID!" });
  res.status(200).json({
    status: "success",
    data: { event },
  });
};

const createEvent: RequestHandler = (req, res, next) => {
  const newId: number = events[events.length - 1].id! + 1;
  const newEvent: Event = Object.assign({ id: newId }, req.body);
  events.push(newEvent);
  fs.writeFile(
    `${__dirname}/dev-data/data/events-simple.json`,
    JSON.stringify(events),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { events: newEvent },
      });
    }
  );
};

const updateEvent: RequestHandler = (req, res, next) => {
  const id: number = +req.params.id;
  console.log(req.body);
  const event = events.find((el) => el.id === id);
  if (!event)
    return res.status(404).json({ status: "fail", message: "Invalid ID!" });
  Object.keys(req.body).forEach((key) => {
    if (key in event) {
      (event as any)[key] = req.body[key];
    }
  });
  const otherEvents = events.filter((el) => el.id !== id);
  const updatedEvents = otherEvents.concat([event]);
  fs.writeFile(
    `${__dirname}/dev-data/data/events-simple.json`,
    JSON.stringify(updatedEvents),
    (err) => {
      res.status(201).json({
        status: "success",
        data: { updatedEvent: event },
      });
    }
  );
};

const deleteEvent: RequestHandler = (req, res, next) => {
  const id: number = +req.params.id;
  const event = events.find((el) => el.id === id);
  if (!event)
    return res.status(404).json({ status: "fail", message: "Invalid ID!" });
  // add deleting logic later
  res.status(204).json({
    status: "success",
    data: null,
  });
};

app.route("/api/v1/events").get(getAllEvent).post(createEvent);
app
  .route("/api/v1/events/:id")
  .get(getEvent)
  .patch(updateEvent)
  .delete(deleteEvent);

const port: number = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
