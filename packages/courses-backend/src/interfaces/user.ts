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

// user.methods.comparePassword = function (
//   candidatePassword: string,
//   callback: any
// ) {
//   bcrypt.compare(
//     candidatePassword,
//     this.password,
//     (err: Error, isMatch: boolean) => {
//       callback(err, isMatch);
//     }
//   );
// };

export default mongoose.model("User", user);
