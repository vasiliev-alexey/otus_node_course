import CourseModel from "@models/Course";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "tslog";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

const listCourse = async (req: Request, res: Response) => {
  logger.debug("course", "/", req.query);

  const data = await CourseModel.find().populate("lessons");
  logger.debug("finded", "/", data[0], data.length);
  res.status(StatusCodes.OK).json(data);
};

const createNewCourse = async (req: Request, res: Response) => {
  logger.debug("course", "/", req.body);
  const { title } = req.body;
  const newCourse = await CourseModel.create({ title });
  res.status(StatusCodes.CREATED).json(newCourse);
};

export { listCourse, createNewCourse };
