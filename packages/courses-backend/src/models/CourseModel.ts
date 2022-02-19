import { Course } from "@course/common";
import { LessonModel } from "@models/LessonModel";
import { SchemaFactory } from "@models/SchemaFactory";
import { UserModel } from "@models/UserModel";
import mongoose, { Schema } from "mongoose";

const courseModel = SchemaFactory<Course>({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: UserModel.modelName,
  },

  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: LessonModel.modelName,
    },
  ],
});
export const CourseModel = mongoose.model<Course>("CourseModel", courseModel);
