import express, { Request, Response } from "express";
import dotenv from "dotenv";

var cors = require("cors");
var mainRouter = require("./src/route/index");

dotenv.config();

const app = express();
const port = process.env.PORT || 8004;

app.use(express.json());
app.use(cors());

app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`Server is running on ${port} port`);
});
