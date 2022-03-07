import { AuthData, UserCredentials } from "@course/common";
import { UserInterface } from "@interfaces/UserInterface";
import { JWTAuthenticate } from "@middlewares/authChecker";
import { UserModel } from "@models/UserModel";
import { AuthService } from "@services/AuthService";
import { TokenService } from "@services/TokenService";
import bcrypt from "bcryptjs";
import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  Authorized,
  BadRequestError,
  Body,
  CookieParam,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  Res,
  UnauthorizedError,
  UseBefore,
} from "routing-controllers";
import { Logger } from "tslog";
import { Inject, Service } from "typedi";

const controllerName = "auth-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

const maxAge =
  Number(process.env.JWT_REFRESH_COOKIE_LIFE_TIME) || 2_592_000_000;

@JsonController("/auth")
@Service()
export class AuthController {
  @Inject()
  private tokenService: TokenService;
  @Inject()
  private authService: AuthService;

  @Post("/register")
  @HttpCode(StatusCodes.CREATED)
  public async registerNewUser(
    @Body() userCredentials: UserCredentials
  ): Promise<Record<string, never>> {
    logger.debug("check user exists  in db");

    const { username, password } = userCredentials;

    try {
      const doc = await UserModel.findOne({ username });
      if (doc) {
        throw new BadRequestError("User Already Exists");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
          username,
          password: hashedPassword,
          isAdmin: true,
        });
        await newUser.save();
        logger.debug("exit ");
        logger.debug("User account saved in db");
        return {};
      }
    } catch (e) {
      throw e;
    }
  }

  @Authorized()
  @Post("/login")
  @HttpCode(StatusCodes.OK)
  public async login(
    @Body() userCredentials: UserCredentials,
    @Res() resp: Response,
    @CurrentUser() user: UserInterface
  ): Promise<AuthData> {
    logger.debug(
      `User ${userCredentials.username} authenticated with entered pass`
    );

    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(user);
    await this.tokenService.saveToken(user.id, refreshToken);

    resp.cookie("refreshToken", refreshToken, {
      maxAge,
      httpOnly: true,
    });
    logger.debug("exit");
    return { accessToken, user };
  }

  @Get("/logout")
  @UseBefore(JWTAuthenticate)
  @HttpCode(StatusCodes.OK)
  async logout(
    @Res() res: Response,
    @CookieParam("refreshToken") refreshToken: string
  ): Promise<boolean | Error> {
    logger.debug("User logout");
    try {
      if (!refreshToken) {
        logger.debug("token not found");
        return false;
      }

      await this.authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      logger.debug("exit from logout");
      return true;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }
  @Get("/refresh")
  async refresh(
    @CookieParam("refreshToken") refreshToken: string,
    @Res() resp: Response
  ) {
    logger.debug("refresh token");
    if (!refreshToken) {
      throw new UnauthorizedError("Пользователь не авторизован");
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      logger.debug("Пользователь не авторизован", !userData, !tokenFromDb);
      throw new UnauthorizedError("Пользователь не авторизован");
    }
    const user = await UserModel.findById(userData.id);
    const userDto = { username: user.username, id: user.id };
    const tokens = this.tokenService.generateTokens({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    resp.cookie("refreshToken", tokens.refreshToken, {
      maxAge,
      httpOnly: true,
    });
    logger.debug("refresh exit");
    return { ...tokens, user: userDto };
  }
}
