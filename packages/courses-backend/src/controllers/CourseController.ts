import { Course } from "@course/common";
import { UserInterface } from "@interfaces/UserInterface";
import { JWTAuthenticate } from "@middlewares/authChecker";
import { CourseService } from "@services/CourseService";
import { StatusCodes } from "http-status-codes";
import {
  Body,
  CurrentUser,
  Get,
  HttpCode,
  JsonController,
  Post,
  UseBefore,
} from "routing-controllers";
import { Logger } from "tslog";
import { Inject, Service } from "typedi";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@JsonController("/courses")
@Service()
export class CourseController {
  @Inject()
  private courseService: CourseService;

  @Get("/")
  async getAll(): Promise<Course[]> {
    logger.debug("course", "/");
    return await this.courseService.getAllCourses();
  }

  @Post("/")
  @HttpCode(StatusCodes.CREATED)
  @UseBefore(JWTAuthenticate)
  public async createNewCourse(
    @Body() course: Course,
    @CurrentUser() user: UserInterface
  ): Promise<Course> {
    logger.debug("create new course", user);

    const newCourse = await this.courseService.createNewCourse(course, user);
    return newCourse;
  }
}
