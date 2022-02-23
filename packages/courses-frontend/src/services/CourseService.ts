import { Course } from "@course/common";
import { AxiosResponse } from "axios";

import axiosClient from "../api/axiosClient";

export default class CourseService {
  static async getAll(): Promise<AxiosResponse<Course[]>> {
    return axiosClient.get<Course[]>("/courses/");
  }
}
