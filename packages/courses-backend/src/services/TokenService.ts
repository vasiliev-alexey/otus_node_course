import { UserInterface } from "@interfaces/UserInterface";
import { TokenModel } from "@models/TokenModel";
import * as jwt from "jsonwebtoken";
import Process from "process";
import { Service } from "typedi";

const secretAccessKey = Process.env.JWT_ACCESS_SECRET || "NOT_ASSIGNED_KEY";
const secretRefreshKey = Process.env.JWT_REFRESH_SECRET || "NOT_ASSIGNED_KEY";
@Service()
export class TokenService {
  generateTokens(user: UserInterface) {
    const userDto = { username: user.username, id: user.id };

    const accessToken = jwt.sign(userDto, secretAccessKey);
    const refreshToken = jwt.sign(userDto, secretRefreshKey, {
      expiresIn: "100s",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async validateRefreshToken(token: string): Promise<UserInterface | null> {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET || "");

      return userData as UserInterface;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });

    return tokenData;
  }
}
