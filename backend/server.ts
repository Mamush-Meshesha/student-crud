import cookieParser from 'cookie-parser';
import 'dotenv/config';

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",

    ],
    credentials: true,
  })
);



app.get("/", (req, res) => {
  res.send("Hello, test App!");
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);


app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ message: "Something went wrong!", error: err.message });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});