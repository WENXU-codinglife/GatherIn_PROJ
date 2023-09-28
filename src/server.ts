import dotenv from "dotenv";
dotenv.config({ path: `${__dirname}/../config.env` });

import app from "./app";

const port: number = +process.env.PORT! || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
