import { User } from "./User";

export interface AuthData {
  accessToken: string;
  user: User;
}
