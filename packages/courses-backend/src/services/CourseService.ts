import { Course } from "@course/common";
import { UserInterface } from "@interfaces/UserInterface";
import { CourseModel } from "@models/CourseModel";
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
