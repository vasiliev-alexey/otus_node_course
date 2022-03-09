import { AuthData } from "@course/common";
import { Command } from "commander";
import * as console from "console";
import { prompt } from "inquirer";
import path from "path";

import axiosClient from "./axiosClient";
import { storage } from "./db";
import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${path.basename(__filename)}-logger`,
});

// Customer Questions
const questions = [
  {
    type: "input",
    name: "login",
    message: "Enter login:",
  },
  {
    type: "password",
    name: "password",
    message: "Enter password:",
  },
];

export const withAuth = (rootProgram: Command): Command => {
  const auth = rootProgram.command("auth");
  auth.command("login").action(() => {
    prompt(questions)
      .then((answers) =>
        axiosClient.post<AuthData>("/auth/login", {
          username: answers.login,
          password: answers.password,
        })
      )
      .then((data) => {
        if (data?.data.accessToken) {
          const token = data.data.accessToken;
          logger.debug("user authed");

          storage.saveToken(token);

          return Promise.resolve();
        } else {
          return Promise.reject("not auth");
        }
      })
      .catch((err) => console.error(err));
  });

  auth.command("logout").action(() => {
    storage.clearToken().then(() => logger.info(" logout from server"));
  });

  return rootProgram;
};
