import moduleAlias from "module-alias";
import { Logger } from "tslog";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as data from "../tsconfig.json";

const paths: Record<string, string[]> = data.compilerOptions.paths;
const aliases: Record<string, string> = {};
for (const key in paths) {
  if (paths.hasOwnProperty(key)) {
    const aliasKey = key.replace("/*", "");
    const aliasValue = String(paths[key]).replace("src/", "").replace("*", "");
    aliases[`${aliasKey}`] = `${__dirname}/${aliasValue}`;
  }
}
moduleAlias.addAliases(aliases);
const logger: Logger = new Logger({ name: "index" });
const port = process.env.PORT || 4000;
import server from "./server";
server.listen(port, () => {
  logger.info("Server Started on Port:", port);
});
