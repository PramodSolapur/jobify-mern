// if you make any changes in .env file, please restart the server
import dotenv from "dotenv";
dotenv.config();

// this package helps to avoid defining try-catch blocks to handle async errors in every controller
import "express-async-errors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import express from "express";
const app = express();

// import connectDB  to connect mongoDb database
import connectDB from "./db/connect.js";

// import modules (if oyu are using ES6 module, add .js extension to import modules)
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authenticateUser from "./middleware/auth.js";

// import Routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobRoutes.js";

const port = process.env.PORT || 5000;

// NOTE: Middlewares always executes in order
// this middleware helps us to get json data coming from req.body
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/build")));
app.use(express.json());

app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

// runs when routes doesn't match
app.use(notFoundMiddleware);

// runs for every route, so place always at the last
app.use(errorHandlerMiddleware);

const startServer = async () => {
  try {
    // server runs if we connected to mongodb database successfully
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is Running on http://localhost:${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
