import { Course } from "@course/common";
import { JWTAuthenticate } from "@middlewares/authChecker";
import { UserInterface } from "@src/interfaces/UserInterface";
import { CourseService } from "@src/services/CourseService";
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
import { Service } from "typedi";

const controllerName = "course-controller";
const logger: Logger = new Logger({ name: `${controllerName}-logger` });

@JsonController("/courses")
@Service()
export class CourseController {
  constructor(private courseService: CourseService) {}

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
