import { Course } from "@course/common";
import { CourseModel } from "@models/CourseModel";
import { UserInterface } from "@src/interfaces/UserInterface";
import { Service } from "typedi";

@Service()
export class CourseService {
  public async getAllCourses(): Promise<Course[]> {
    const courses = await CourseModel.find().exec();

    return courses;
  }

  async createNewCourse(course: Course, user: UserInterface): Promise<Course> {
    const newCourse = await CourseModel.create({
      ...course,
      author: user,
    });
    return newCourse;
  }
}
