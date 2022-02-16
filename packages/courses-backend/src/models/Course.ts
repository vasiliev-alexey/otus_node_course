// require("module-alias/register");
import { Course } from "@course/common";
import Lesson from "@models/Lesson";
import { SchemaFactory } from "@models/SchemaFactory";
import User from "@models/User";
import mongoose, { Schema } from "mongoose";

const course = SchemaFactory<Course>({
  title: {
    type: String,
    required: true,
  },

  author: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
  },

  lessons: [
    {
      type: Schema.Types.ObjectId,
      ref: Lesson.modelName,
    },
  ],
});
export default mongoose.model<Course>("Course", course);
