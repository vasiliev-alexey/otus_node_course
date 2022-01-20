#!/usr/bin/env node
import { program } from "commander";
import pkg from "../package.json";
import walk from "./services/tree";
import * as Path from "path";
import { printer } from "./services/printer";

const appName = pkg.name;

program
  .description(pkg.description)
  .name(appName)
  .version(pkg.version)
  .argument("<root directory>", "root directory")
  .option("-d, --depth <command>", "structure display depth", "2")
  .action(async (root, options) => {
    // const dir = Path.basename(Path.resolve(root));

    //console.log("dir", dir);
    const files = await walk(Path.normalize(root), options.depth);
    // console.log("files", files);
    printer(files);
  });

program.parse(process.argv);
