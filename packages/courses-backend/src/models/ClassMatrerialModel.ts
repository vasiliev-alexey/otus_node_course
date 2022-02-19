import { ClassMaterial } from "@course/common";
import { SchemaFactory } from "@models/SchemaFactory";
import User from "@models/UserModel";
import mongoose, { Schema } from "mongoose";

const classMaterial = SchemaFactory<ClassMaterial>({
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: User.modelName,
    required: true,
  },
});
export default mongoose.model<ClassMaterial>("ClassMaterial", classMaterial);
