import { generateBigFile } from "./services/fileGenerator";
import Path from "path";
import { splitFile } from "./services/splitFile";
import { readAndFind } from "./services/readAndFind";
import { sortFiles } from "./services/sortFile";
import { rootLogger } from "./services/logger";

const logger = rootLogger.getChildLogger({
  name: "main-logger",
});

const dataDir = Path.resolve(__dirname, "..", "data/");
const splitCount = 7;

const account = async () => {
  logger.info(" start main work");
  logger.info(" memoryUsage ZerO Step : ", process.memoryUsage());

  const fileName = await generateBigFile(dataDir);
  logger.info(" finish generator");
  logger.info(" memoryUsage before splitFile : ", process.memoryUsage());
  const fileParts = await splitFile(dataDir, fileName, splitCount);
  logger.info(" memoryUsage after splitFile : ", process.memoryUsage());
  logger.info(" finish generator");

  const fileSorted = await sortFiles(fileParts);
  logger.info(" memoryUsage after sortFiles : ", process.memoryUsage());

  await readAndFind(dataDir, fileSorted);

  logger.info(" finish dataDir work");
};

account();
