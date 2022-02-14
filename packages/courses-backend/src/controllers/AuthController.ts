import { UserCredentials } from "@course/common";
import User from "@models/User";
import bcrypt from "bcryptjs";
import { Response } from "express";
import * as jwt from "jsonwebtoken";
import * as Process from "process";
import {
  Authorized,
  Body,
  JsonController,
  Post,
  Res,
} from "routing-controllers";
import { Logger } from "tslog";

const controllerName = "auth-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@JsonController("/auth")
export class AuthController {
  @Post("/register")
  public async registerNewUser(
    @Body() userCredentials: UserCredentials,
    @Res() resp: Response
  ): Promise<void> {
    logger.debug("check user exists  in db");

    const { username, password } = userCredentials;

    try {
      const doc = await User.findOne({ username });
      if (doc) {
        resp.status(400).json({ message: "User Already Exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          password: hashedPassword,
          isAdmin: true,
        });
        await newUser.save();
        logger.debug("exit ");
        logger.debug("User account saved in db");
        resp.status(201).json({});
      }
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Post("/login")
  //@UseBefore(passport.authenticate("local"))
  public async login(
    @Body() userCredentials: UserCredentials,
    @Res() resp: Response
  ) {
    logger.debug(
      `User ${userCredentials.username} authenticated with entered pass`
    );
    const token = jwt.sign(
      { username: userCredentials.username },
      Process.env.JWT_SECRET || "NOT_ASSIGNED_KEY"
    );
    resp.status(200).send({ token: token });
  }

  // @Get("/logout")
  // @SuccessResponse(StatusCodes.NO_CONTENT, "No Content")
  // logout(
  //   @Req() request: Express.Request,
  //   @Res() oddCountErr: TsoaResponse<403, {}>
  // ) {
  //   logger.debug("User logout", request);
  //   //  res.statusCode(StatusCodes.NO_CONTENT).send();
  //   request.logout();
  //   return oddCountErr(403, {});
  // }
}
