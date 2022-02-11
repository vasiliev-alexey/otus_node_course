import { UserCredentials } from "@course/common";
import User from "@src/interfaces/user";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { Logger } from "tslog";
import { Body, Get, Post, Response, Route, SuccessResponse } from "tsoa";

const controllerName = "auth-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@Route("auth")
export default class AuthController {
  @Post("/register")
  @SuccessResponse("201", "Created")
  @Response<{ message: string }>(401, "Register Failed")
  public async registerNewUser(
    @Body() userCredentials: UserCredentials
  ): Promise<void> {
    logger.debug("check user exists  in db");

    const { username, password } = userCredentials;

    try {
      const doc = await User.findOne({ username });
      if (doc) {
        throw Error("User Already Exists");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          password: hashedPassword,
          isAdmin: true,
        });
        await newUser.save();
        logger.debug("User account saved in db");
      }
    } catch (e) {
      throw e;
    }
  }

  @Post("/login")
  public async login(@Body() userCredentials: UserCredentials) {
    logger.debug(
      `User ${userCredentials.username} authenticated with entered pass`
    );
  }
  @Get("/logout")
  @SuccessResponse(StatusCodes.NO_CONTENT, "No Content")
  public async logout() {
    logger.debug("User logout");
  }
}
