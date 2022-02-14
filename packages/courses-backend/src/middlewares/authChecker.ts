// import { NextFunction, Request, Response } from "express";
// import passport from "passport";
// import { Logger } from "tslog";
// const logger: Logger = new Logger({ name: "authChecker-logger" });
//
// export const authenticateJWT = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   passport.authenticate("jwt", function (err, user, _info) {
//     if (err) {
//       logger.error(err);
//       return res.status(401).json({ status: "error", code: "unauthorized" });
//     }
//     if (!user) {
//       return res.status(401).json({ status: "error", code: "unauthorized" });
//     } else {
//       return next();
//     }
//   })(req, res, next);
// };

import passport from "passport";
import { Action } from "routing-controllers";
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
        if (err) {
          logger.error(err);
          return resolve(false);
        }
        if (!user) {
          logger.info("Auth failed");
          action.response.code = 400;
          return resolve(false);
        } else {
          logger.info("Auth success");
          return resolve(true);
        }
      })(action.request, action.response, action.next);

      return resolve(true);
    }
  });
