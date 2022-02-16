import "reflect-metadata";

import { authorizationChecker } from "@middlewares/authChecker";
import { configureWithPassport } from "@src/middlewares/passport";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { Action, createExpressServer } from "routing-controllers";
import { Logger } from "tslog";

const logger: Logger = new Logger({ name: "server" });

dotenv.config();

const loggerMiddleWare = morgan(process.env.LOGGER_LEVEL || "dev");

// Middleware

const app = createExpressServer({
  controllers: [__dirname + "/controllers/*.ts"], // we specify controllers we want to use
  defaultErrorHandler: false,
  classTransformer: false,
  cors: {
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: "http://localhost",
  },
  authorizationChecker: authorizationChecker,
  currentUserChecker: (action: Action) => {
    // const token = action.request.headers["authorization"];
    //
    // const jwt_payload = jwt.decode(token);
    // console.log("77777", jwt_payload);
    return action.request.user;
  },
});

app.use(express.json()).use(loggerMiddleWare);

app.use(cookieParser());

// mongo
mongoose.connect(
  process.env.MONGO_URL ||
    `mongodb://mongouser:mongopass@localhost:27017/ads?authSource=admin`,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    logger.info("process.env.MONGO_URL", process.env.MONGO_URL);

    if (err) throw err;
    logger.info("Connected To Mongo");
  }
);

// Passport
configureWithPassport(app);
app.use(express.static("public"));

//static front

/*
let basePath = "../../dist/client/dist";
if (process.env.NODE_ENV === "development") {
  basePath = "../../..//dist/client/dist/";
}
app.use(express.static(path.resolve(__dirname, basePath)));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, basePath, "index.html"));
});
*/
//app.use(serverError);
const server = app;

export default server;
