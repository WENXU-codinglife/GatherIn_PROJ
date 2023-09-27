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

// app.get("/", (req: Request, res: Response) => {
//   res
//     .status(200)
//     .send({ message: "Hello from the server side!", app: "GatherIn" });
// });

// app.post("/", (req: Request, res: Response) => {
//   res.send("You can post to this endpoint!");
// });

const events: Event[] = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/events-simple.json`).toString()
);
app.get("/api/v1/events", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    results: events.length,
    data: { events },
  });
});

app.get("/api/v1/events/:id", (req: Request, res: Response) => {
  const event = events.find((el) => el.id === +req.params.id);
  res.status(200).json({
    status: "success",
    data: { event },
  });
});

app.post("/api/v1/events", (req: Request, res: Response) => {
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
});

const port: number = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
