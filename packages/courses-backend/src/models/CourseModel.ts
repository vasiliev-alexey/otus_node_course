import { Course, User } from "@course/common";
import { LessonModel } from "@models/LessonModel";
import { SchemaFactory } from "@models/SchemaFactory";
import { UserModel } from "@models/UserModel";
import mongoose, { Schema } from "mongoose";

const courseModel = SchemaFactory<Course>({
  title: {
    type: String,
    maxlength: 200,
    required: true,
  },
  description: {
    type: String,
    maxlength: 200,
    required: true,
  },
  imageString: {
    type: String,
    required: false,
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
//
courseModel.virtual("authorName").get(function (this: { author: User }) {
  if (this.author) {
    return this.author.username;
  }
  return "";
});

export const CourseModel = mongoose.model<Course>("Course", courseModel);
