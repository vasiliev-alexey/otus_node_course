import moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@src": __dirname,
  "@controllers": __dirname + "/controllers/",
  "@models": __dirname + "/models/",
});

// import Router from "./routes";
import { courseRouter } from "@src/routes/courseRouter";
import { serverError } from "@src/routes/errorHandler";
import cookieParser from "cookie-parser";
import cors from "cors";
// import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
// import passport from "passport";
//import * as path from "path";
import { Logger } from "tslog";
//import courseRouter from "./routes/courseRouter";
//const LocalStrategy = passportLocal.Strategy;

const logger: Logger = new Logger({ name: "server" });

dotenv.config();

const port = process.env.PORT || 4000;

const loggerMiddleWare = morgan(process.env.LOGGER_LEVEL || "dev");

// Middleware
const app = express();
app.use(express.json()).use(loggerMiddleWare);

app.use(
  cors({
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: "http://localhost",
  })
);

app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

app.use(serverError);

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
/*
 app.use(passport.initialize());
 app.use(passport.session());
passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne(
      { username: username },
      (err: Error, user: DatabaseUserInterface) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(password, user.password, (err, result: boolean) => {
          if (err) throw err;
          if (result === true) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      }
    );
  })
);

passport.serializeUser((user: DatabaseUserInterface, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: Error, user: DatabaseUserInterface) => {
    const userInformation: UserInterface = {
      username: user.username,
      isAdmin: user.isAdmin,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

*/

// Routes
// app.use("/auth", authRouter);
app.use("/course", courseRouter);

app.use(express.static("public"));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);

//app.use(Router);

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
const server = app.listen(port, () => {
  logger.info("Server Started on Port:", port);
});

export default server;
