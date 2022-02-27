import { Course } from "@course/common";
import { AxiosResponse } from "axios";

import axiosClient from "../api/axiosClient";

export default class CourseService {
  static async getAll(): Promise<AxiosResponse<Course[]>> {
    return axiosClient.get<Course[]>("/courses/");
  }

  static async createNewCourse(
    course: Course,
    file: File
  ): Promise<AxiosResponse<Course>> {
    const formData = new FormData();
    formData.append("title", course.title);
    formData.append("description", course.description);
    formData.append("icon", file);

    return axiosClient.post<Course>("/courses/newCourse", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}
