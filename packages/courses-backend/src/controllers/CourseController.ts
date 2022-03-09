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
  Param,
  Post,
  UploadedFile,
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
  @HttpCode(StatusCodes.OK)
  async getAll(): Promise<Course[]> {
    logger.debug("course", "/");

    const data = await this.courseService.getAllCourses();

    return data;
  }

  @Post("/newCourse")
  @HttpCode(StatusCodes.CREATED)
  @UseBefore(JWTAuthenticate)
  public async createNewCourse(
    @Body() course: Course,
    @CurrentUser() user: UserInterface,
    @UploadedFile("icon") file: Express.Multer.File
  ): Promise<Course> {
    logger.debug("create new course", course, file);

    if (file) {
      course.imageString = file.buffer.toString("base64");
    }

    const newCourse = await this.courseService.createNewCourse(course, user);
    return newCourse;
  }

  @Post("/editCourse")
  @HttpCode(StatusCodes.OK)
  @UseBefore(JWTAuthenticate)
  public async editCourse(
    @Body() course: Course,
    @CurrentUser() user: UserInterface,
    @UploadedFile("icon") file: Express.Multer.File
  ): Promise<Course | null> {
    logger.debug("edit course", course);

    if (file) {
      course.imageString = file.buffer.toString("base64");
    }

    const newCourse = await this.courseService.editCourse(course);
    return newCourse;
  }

  @Get("/:id")
  @HttpCode(StatusCodes.OK)
  @UseBefore(JWTAuthenticate)
  public async getOne(@Param("id") id: string): Promise<Course | null> {
    logger.debug("GetCourseById", id);
    const newCourse = await this.courseService.GetCourseById(id);
    return newCourse;
  }
}
