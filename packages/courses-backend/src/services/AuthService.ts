import { TokenService } from "@src/services/TokenService";
const tokenService = new TokenService();

export class AuthService {
  async logout(refreshToken: string): Promise<string> {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
}
