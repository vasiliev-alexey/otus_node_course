import { program } from "commander";
import pkg from "../../package.json";
import walk from "./walk";
import Path from "path";
import { printer } from "./printer";

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
