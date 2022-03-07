import { DatabaseUserInterface } from "@interfaces/UserInterface";
import { SchemaFactory } from "@models/SchemaFactory";
import mongoose from "mongoose";

const userModel = SchemaFactory<DatabaseUserInterface>({
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

export const UserModel = mongoose.model("User", userModel);
