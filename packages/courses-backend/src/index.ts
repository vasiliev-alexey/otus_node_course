import moduleAlias from "module-alias";
moduleAlias.addAliases({
  "@src": __dirname,
  "@controllers": __dirname + "/controllers/",
  "@models": __dirname + "/models/",
});

import { Logger } from "tslog";

import server from "./server";

const logger: Logger = new Logger({ name: "index" });

const port = process.env.PORT || 4000;

server.listen(port, () => {
  logger.info("Server Started on Port:", port);
});
