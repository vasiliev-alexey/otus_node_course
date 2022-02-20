import { TokenService } from "@services/TokenService";
import { Service } from "typedi";
const tokenService = new TokenService();
@Service()
export class AuthService {
  async logout(refreshToken: string): Promise<string> {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
}
