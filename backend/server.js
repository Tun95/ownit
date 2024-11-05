import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import { createServer } from "http";
import uploadRouter from "./routes/uploadRoutes.js";
import sendEmailRouter from "./routes/emailMsgRoutes.js";
import userRouter from "./routes/userRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import generalRouter from "./routes/generalRoutes.js";
import helmet from "helmet";
import fetch from "node-fetch"; // Import fetch for making HTTP requests

dotenv.config();

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 1000000,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginEmbedderPolicy: { policy: "require-corp" },
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Server is alive");
});

app.use("/api/upload", uploadRouter);
app.use("/api/message", sendEmailRouter);
app.use("/api/users", userRouter);
app.use("/api/reports", reportRouter);
app.use("/api/generals", generalRouter);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(_dirname, "/frontend/build/index.html"))
);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const server = createServer(app);
const port = process.env.PORT || 5000;

// Increase timeout settings
server.setTimeout(1000000); // 10 minutes
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// Ping server every 14 minutes to keep it awake
const pingInterval = 14 * 60 * 1000; // 14 minutes in milliseconds
setInterval(() => {
  fetch(process.env.BACKEND_BASE_URL)
    .then((res) => {
      if (res.ok) {
        console.log("Ping successful");
      } else {
        console.log("Ping failed");
      }
    })
    .catch((error) => console.log("Ping error:", error));
}, pingInterval);
