import mongoose from "mongoose";

const user = new mongoose.Schema({
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
