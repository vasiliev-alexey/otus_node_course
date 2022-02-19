import { Lesson } from "@course/common";
import { CommentModel } from "@models/CommentModel";
import { SchemaFactory } from "@models/SchemaFactory";
import mongoose, { Schema } from "mongoose";

const lessonModel = SchemaFactory<Lesson>({
  topic: {
    type: String,
    required: true,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: CommentModel.modelName,
    },
  ],
});
export const LessonModel = mongoose.model<Lesson>("Lesson", lessonModel);
