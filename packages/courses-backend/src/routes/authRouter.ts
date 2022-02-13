import AuthController from "@controllers/authController";
import { UserInterface } from "@src/interfaces/UserInterface";
import express from "express";
import { StatusCodes } from "http-status-codes";
import * as jwt from "jsonwebtoken";
import passport from "passport";
import { Logger } from "tslog";

const logger: Logger = new Logger({ name: "authLogger" });

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/register", async (req, res) => {
  logger.debug("/register");

  const { username, password } = req?.body;
  if (
    !username ||
    !password ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    logger.debug("/register error");
    res.status(StatusCodes.BAD_REQUEST).send("Improper Values");
    return;
  }

  logger.debug("check user in auth service");

  try {
    await authController.registerNewUser({ username, password });
    res.sendStatus(StatusCodes.CREATED);
  } catch (err) {
    logger.error("register user  error", err.message);
    res.status(StatusCodes.BAD_REQUEST).send({ message: err.message });
  }
});

authRouter.post("/login", passport.authenticate("local"), async (req, res) => {
  logger.debug("login login login");

  if (req.user) {
    const dbUser = req.user as UserInterface;
    await authController.login({ username: dbUser.username, password: "" });
    //res.send({ userId: dbUser.id, userName: dbUser.username });
    const token = jwt.sign({ username: dbUser.username }, "JWT_SECRET");
    res.status(200).send({ token: token });
  } else {
    logger.debug("user NOT defined");
    res.status(StatusCodes.BAD_REQUEST).send({});
  }
});

authRouter.get("/logout", async (req, res) => {
  req.logout();
  await authController.logout();
  logger.debug("logout logout logout", req.user);
  res.status(StatusCodes.NO_CONTENT).send();
});

export { authRouter };
