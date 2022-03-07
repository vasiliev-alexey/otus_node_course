import { Token } from "@interfaces/Token";
import { UserModel } from "@models/UserModel";
import { model, Schema } from "mongoose";

const TokenSchema = new Schema<Token>({
  user: { type: Schema.Types.ObjectId, ref: UserModel.modelName },
  refreshToken: { type: String, required: true },
});
const TokenModel = model("Token", TokenSchema);

export { TokenModel };
