import { Course } from "@course/common";
import { UserInterface } from "@interfaces/UserInterface";
import { CourseModel } from "@models/CourseModel";
import { Service } from "typedi";

@Service()
export class CourseService {
  public async getAllCourses(): Promise<Course[]> {
    const courses = await CourseModel.find()
      .populate("author", {
        username: 4,
      })
      //      .select({ _id: 1, id: 1, title: 1, authorName: 1, author: 1 })
      .exec();
    return courses.map((course) => {
      return {
        title: course.title,
        id: course.id,
        authorName: course.authorName,
        description: course.description,
        imageString: course.imageString,
      };
    });

    //return courses;
  }

  async createNewCourse(course: Course, user: UserInterface): Promise<Course> {
    const newCourse = await CourseModel.create({
      ...course,

      author: user,
    });
    await newCourse.save();
    return newCourse;
  }
}
