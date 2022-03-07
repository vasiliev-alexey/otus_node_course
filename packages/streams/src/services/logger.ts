import { config } from "dotenv";
import { Logger, TLogLevelName } from "tslog"; // eslint-disable-line import/named
config();

export const rootLogger: Logger = new Logger({
  name: "Root Logger",
  minLevel: (process.env.DEBUG_LEVEL as TLogLevelName) || "info",
});
