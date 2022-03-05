import { Logger, TLogLevelName } from "tslog"; // eslint-disable-line import/named

import { config } from "dotenv";
config();

console.log("process.env.DEBUG_LEVEL", process.env.DEBUG_LEVEL);

export const rootLogger: Logger = new Logger({
  name: "Root Logger",
  minLevel: (process.env.DEBUG_LEVEL as TLogLevelName) || "info",
});
