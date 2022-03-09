#!/usr/bin/env node
import { program } from "commander";

import pkg from "../package.json";
import { withAuth } from "./services/auth";
import { withCourse } from "./services/courses";
import { rootLogger } from "./services/logger";

const logger = rootLogger.getChildLogger({
  name: "main-logger",
});

const appName = pkg.name;

logger.debug("start");

program.description(pkg.description).name(appName).version(pkg.version);
withAuth(program);
withCourse(program);

program.parse(process.argv);
