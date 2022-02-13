import { Course } from "@course/common";
import CourseModel from "@models/Course";
import { ErrorResponse } from "@src/interfaces/ErrorDto";
import { StatusCodes } from "http-status-codes";
import { Logger } from "tslog";
import {
  Body,
  Get,
  Post,
  Response,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@Route("courses")
export default class CourseController {
  @Get("/")
  @Security("jwt")
  public async getCourses(): Promise<Course[]> {
    logger.debug("course", "/");
    const data = await CourseModel.find().populate("lessons");
    return data;
  }
  @Post("/")
  @Response<ErrorResponse>(StatusCodes.UNAUTHORIZED, "Unauthorized error")
  @Response<ErrorResponse>(StatusCodes.BAD_REQUEST, "Unauthorized error")
  @SuccessResponse(StatusCodes.CREATED, "Created")
  public async createNewCourse(@Body() param: Course): Promise<Course> {
    const newCourse = await CourseModel.create(param);
    return newCourse;
  }
}
