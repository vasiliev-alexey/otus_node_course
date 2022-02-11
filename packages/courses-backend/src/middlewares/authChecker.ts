import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "tslog";
const logger: Logger = new Logger({ name: "authChecker-logger" });

export const authChecker = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.debug("checker", req.path);
  if (req.user || req.path === "/auth") {
    logger.debug("checker ->");
    next();
  } else {
    logger.debug("checker !!!");
    res.status(StatusCodes.UNAUTHORIZED).send({ message: "Not auth" });
  }
};
