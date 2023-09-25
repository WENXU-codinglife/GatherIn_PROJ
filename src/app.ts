import express, { Request, Response, NextFunction } from "express";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello from the server side!");
});

const port: number = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
