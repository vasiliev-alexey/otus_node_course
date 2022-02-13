import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Logger } from "tslog";
const logger: Logger = new Logger({ name: "authChecker-logger" });

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", function (err, user, _info) {
    if (err) {
      logger.error(err);
      return res.status(401).json({ status: "error", code: "unauthorized" });
    }
    if (!user) {
      return res.status(401).json({ status: "error", code: "unauthorized" });
    } else {
      return next();
    }
  })(req, res, next);
};
