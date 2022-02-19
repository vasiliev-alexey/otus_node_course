import { Request, Response } from "express";
import passport from "passport";
import { Action, ExpressMiddlewareInterface } from "routing-controllers";
import { Logger } from "tslog";

const logger: Logger = new Logger({ name: "auth-checker" });
export const authorizationChecker = (action: Action) =>
  new Promise<boolean>((resolve, reject) => {
    if (action.request.originalUrl === "/auth/login") {
      passport.authenticate("local", (err, user) => {
        if (err) {
          return reject(err);
        }
        if (!user) {
          return resolve(false);
        }
        action.request.user = user;
        return resolve(true);
      })(action.request, action.response, action.next);
    } else {
      passport.authenticate("jwt", function (err, user, _info) {
        logger.info("used jwt check");
        if (err) {
          logger.error(err);
          return resolve(false);
        }
        if (!user) {
          logger.info("Auth failed");
          action.response.code = 400;
          return resolve(false);
        } else {
          logger.info("Auth success", user);
          action.request.user = user;
          return resolve(true);
        }
      })(action.request, action.response, action.next);

      return resolve(true);
    }
  });

export class JWTAuthenticate implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next?: (err?: Error) => void): void {
    logger.info("Check  user auth");
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
}

export class SetRefreshCookie implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next?: (err?: Error) => void): void {
    logger.info("Check  user auth");
    passport.authenticate("jwt", { session: false })(req, res, next);
  }
}
