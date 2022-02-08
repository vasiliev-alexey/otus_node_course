import { Course } from "@course/common";
import CourseModel from "@models/Course";
import { Logger } from "tslog";
import { Body, Get, Post, Route } from "tsoa";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@Route("courses")
export default class CourseController {
  @Get("/")
  public async getMessage(): Promise<Course[]> {
    logger.debug("course", "/");
    const data = await CourseModel.find().populate("lessons");
    return data;
  }
  @Post("/")
  public async createNewCourse(@Body() param: Course): Promise<Course> {
    const newCourse = await CourseModel.create(param);
    return newCourse;
  }
}
