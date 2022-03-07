import { ClassMaterial } from "@course/common";
import { SchemaFactory } from "@models/SchemaFactory";
import { UserModel } from "@models/UserModel";
import mongoose, { Schema } from "mongoose";

const classMaterial = SchemaFactory<ClassMaterial>({
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
export default mongoose.model<ClassMaterial>("ClassMaterial", classMaterial);
