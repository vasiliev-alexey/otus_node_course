import { AuthData, UserCredentials } from "@course/common";
import { AxiosResponse } from "axios";

import axiosClient from "../api/axiosClient";

export default class AuthService {
  static async login(
    credentials: UserCredentials
  ): Promise<AxiosResponse<AuthData>> {
    return axiosClient.post<AuthData>("/auth/login", credentials);
  }

  static async registration(
    credentials: UserCredentials
  ): Promise<AxiosResponse<AuthData>> {
    return axiosClient.post<AuthData>("/auth/register", credentials);
  }

  static async logout(): Promise<void> {
    return axiosClient.get("/auth/logout");
  }
}
