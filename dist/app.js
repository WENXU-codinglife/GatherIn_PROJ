"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
// app.get("/", (req: Request, res: Response) => {
//   res
//     .status(200)
//     .send({ message: "Hello from the server side!", app: "GatherIn" });
// });
// app.post("/", (req: Request, res: Response) => {
//   res.send("You can post to this endpoint!");
// });
const events = JSON.parse(fs_1.default.readFileSync(`${__dirname}/dev-data/data/events-simple.json`).toString());
app.get("/api/v1/events", (req, res) => {
    res.status(200).json({
        status: "success",
        results: events.length,
        data: { events },
    });
});
app.get("/api/v1/events/:id", (req, res) => {
    const id = +req.params.id;
    const event = events.find((el) => el.id === id);
    if (!event)
        return res.status(404).json({ status: "fail", message: "Invalid ID!" });
    res.status(200).json({
        status: "success",
        data: { event },
    });
});
app.post("/api/v1/events", (req, res) => {
    const newId = events[events.length - 1].id + 1;
    const newEvent = Object.assign({ id: newId }, req.body);
    events.push(newEvent);
    fs_1.default.writeFile(`${__dirname}/dev-data/data/events-simple.json`, JSON.stringify(events), (err) => {
        res.status(201).json({
            status: "success",
            data: { events: newEvent },
        });
    });
});
app.patch("/api/v1/events/:id", (req, res) => {
    const id = +req.params.id;
    const event = events.find((el) => el.id === id);
    if (!event)
        return res.status(404).json({ status: "fail", message: "Invalid ID!" });
    res.status(200).json({
        status: "success",
        data: {
            event: "<updated event here...>",
        },
    });
});
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
