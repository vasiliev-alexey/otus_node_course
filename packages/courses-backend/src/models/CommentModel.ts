import { Comment } from "@course/common";
import { SchemaFactory } from "@models/SchemaFactory";
import { UserModel } from "@models/UserModel";
import mongoose, { Schema } from "mongoose";

const lesson = SchemaFactory<Comment>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: UserModel.modelName,
    required: true,
  },
});
export const CommentModel = mongoose.model<Comment>("CommentModel", lesson);
