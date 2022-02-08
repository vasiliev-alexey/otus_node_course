import { Course } from "@course/common";
import { Request } from "express";

export interface RequestWithCourse extends Request {
  course: Course;
}
