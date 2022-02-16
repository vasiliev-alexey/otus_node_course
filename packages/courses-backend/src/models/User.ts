import { SchemaFactory } from "@models/SchemaFactory";
import { DatabaseUserInterface } from "@src/interfaces/UserInterface";
import mongoose from "mongoose";

const user = SchemaFactory<DatabaseUserInterface>({
  username: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  password: {
    type: String,
    unique: true,
    required: true,
    minlength: 3,
  },
  isAdmin: Boolean,
});

export default mongoose.model("User", user);
