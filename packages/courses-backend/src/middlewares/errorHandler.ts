import { ErrorRequestHandler } from "express";
import { Logger } from "tslog";

const controllerName = "error-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

export const serverError: ErrorRequestHandler = (err, req, _res, _) => {
  logger.error(err);
  logger.error(req.body);
};
