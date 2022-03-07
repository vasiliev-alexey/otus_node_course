import "reflect-metadata";

import { authorizationChecker } from "@middlewares/authChecker";
import { configureWithPassport } from "@src/middlewares/passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import { Action, createExpressServer, useContainer } from "routing-controllers";
import { Logger } from "tslog";
import { Container } from "typedi";

const logger: Logger = new Logger({ name: "server" });

dotenv.config();

const loggerMiddleWare = morgan(process.env.LOGGER_LEVEL || "dev");

useContainer(Container);

// Middleware

const app = createExpressServer({
  controllers: [__dirname + "/controllers/*.ts"], // we specify controllers we want to use
  //defaultErrorHandler: false,
  middlewares: [cookieParser, loggerMiddleWare],
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
// app.use(cookieParser());
//app.use(express.json());

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
//app.use(express.static("public"));
//static front
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "..", "public")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

const server = app;

export default server;
