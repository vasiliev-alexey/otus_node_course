// require("module-alias/register");
import { Lesson } from "@course/common";
import { SchemaFactory } from "@models/SchemaFactory";
import mongoose from "mongoose";

const lesson = SchemaFactory<Lesson>({
  topic: {
    type: String,
    required: true,
  },
});
export default mongoose.model<Lesson>("Lesson", lesson);
