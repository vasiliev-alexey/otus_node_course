import { Course } from "@course/common";
import { Authenticate } from "@middlewares/authChecker";
import courseModel from "@models/Course";
import { UserInterface } from "@src/interfaces/UserInterface";
import { Request } from "express";
import {
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  Req,
  UseBefore,
} from "routing-controllers";
import { Logger } from "tslog";
const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@JsonController("/courses")
export class CourseController {
  @Get("/")
  async getAll(): Promise<Course[]> {
    logger.debug("course", "/");
    const data = await courseModel.find().exec();
    logger.debug("course", "data", data);
    return data;
  }
  @Post("/")
  @HttpCode(201)
  @UseBefore(Authenticate)
  public async createNewCourse(
    @Body() param: Course,
    @Req() req: Request,
    @CurrentUser() user: UserInterface
  ): Promise<Course> {
    logger.debug("create nre course", req.user, user);
    const newCourse = await courseModel.create({
      ...param,
      author: user,
    });
    return newCourse;
  }
}
