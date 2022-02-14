import { Course } from "@course/common";
import courseModel from "@models/Course";
import {
  Authorized,
  Body,
  Get,
  HttpCode,
  JsonController,
  Post,
} from "routing-controllers";
import { Logger } from "tslog";
// import { Body, Post, Response, Route, SuccessResponse } from "tsoa";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@JsonController("/courses")
export class CourseController {
  @Get("/")
  async getAll(): Promise<Course[]> {
    logger.debug("course", "/");
    const data = await courseModel.find().exec();
    logger.debug("course", "data", data);

    //data.forEach((d) => console.log("s", d));

    // return data.map((doc) => {
    //   return doc.toJSON();
    // });
    return data;
  }
  @Post("/")
  @Authorized()
  @HttpCode(201)
  public async createNewCourse(@Body() param: Course): Promise<Course> {
    const newCourse = await courseModel.create(param);
    return newCourse;
  }
}
