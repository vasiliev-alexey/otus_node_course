import { program } from "commander";
import Path from "path";

import pkg from "../../package.json";
import { printer } from "./printer";
import walk from "./walk";

const appName = pkg.name;

program
  .description(pkg.description)
  .name(appName)
  .version(pkg.version)
  .argument("<root directory>", "root directory")
  .option("-d, --depth <command>", "structure display depth", "2")
  .action(async (root, options) => {
    const files = await walk(Path.normalize(root), options.depth);
    printer(files);
  });

export default program;
