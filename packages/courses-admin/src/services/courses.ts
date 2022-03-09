import { Course } from "@course/common";
import colors from "colors";
import { Command } from "commander";
import * as console from "console";
import { prompt } from "inquirer";
import path from "path";

import axiosClient from "./axiosClient";
import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${path.basename(__filename)}-logger`,
});

const questionsOnInsert = [
  {
    type: "input",
    name: "title",
    message: "Enter title:",
  },
  {
    type: "input",
    name: "description",
    message: "Enter description:",
  },
];
const questionsOnUpdate = [
  {
    type: "input",
    name: "title",
    message: "Enter New title:",
  },
  {
    type: "input",
    name: "description",
    message: "Enter New description:",
  },
];

export const withCourse = (rootProgram: Command): Command => {
  const auth = rootProgram.command("courses");
  auth.command("list").action(() => {
    logger.debug("get course list info");
    axiosClient.get<Course[]>("/courses/").then((data) =>
      data.data.forEach((d) =>
        //eslint-disable-next-line no-console
        console.info(
          colors.green("Id: %s  title: %s  description: %s"),
          d.id,
          d.title,
          d.description
        )
      )
    );
  });

  auth.command("add").action(() => {
    logger.debug("get course list info");
    prompt(questionsOnInsert)
      .then((answers) =>
        axiosClient.post<Course>("/courses/newCourse", {
          title: answers.title,
          description: answers.description,
        })
      )
      .then((data) => {
        console.log("course created with id:", data.data.id);
      });
  });

  auth
    .command("edit <_id>")

    .action((id) => {
      logger.debug("get course list info");
      prompt(questionsOnUpdate)
        .then((answers) =>
          axiosClient.post<Course>("/courses/editCourse", {
            id,
            title: answers.title,
            description: answers.description,
          })
        )
        .then((data) => {
          if (data.data) {
            console.log("course edited with id:", data.data.id);
          } else {
            console.error("course not edited ");
          }
        });
    });

  return rootProgram;
};
