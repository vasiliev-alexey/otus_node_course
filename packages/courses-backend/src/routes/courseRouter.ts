import CourseController from "@controllers/courseController";
import { Course } from "@course/common";
import { authenticateJWT } from "@middlewares/authChecker";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { Logger } from "tslog";

export { courseRouter };

const courseRouter = express.Router();

const logger: Logger = new Logger({ name: `courseRouter-logger` });

courseRouter.get("/", authenticateJWT, async (_req, res) => {
  const controller = new CourseController();
  const response = await controller.getCourses();
  return res.status(StatusCodes.OK).send(response);
});

courseRouter.post("/", async (req, res) => {
  logger.debug("course", "/", req.body);
  const courseDto: Course = req.body;
  const controller = new CourseController();
  const newCourse = await controller.createNewCourse(courseDto);
  res.status(StatusCodes.CREATED).json(newCourse);
});
