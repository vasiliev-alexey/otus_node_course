import * as fs from "fs";
import * as Path from "path";

import { CONTENT_LENGTH } from "../types";
import path from "path";
import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${path.basename(__filename)}-logger`,
});

const fileExists = (path: string) => fs.existsSync(path);
const fileName = "data100mb.data";

export const generateBigFile = (dataPath: string): Promise<string> => {
  const fileData = Path.resolve(dataPath, fileName);
  let fileSize = 0;
  if (fileExists(fileData)) {
    fs.truncateSync(fileData);
  }

  let generationCount = 0;

  let dataFrameLimit = 10000;
  let expectedSize = 0;

  while (true) {
    generationCount++;
    const data = [];
    for (let i = 0; i < dataFrameLimit; i++) {
      data.push(Math.floor(Math.random() * (Math.random() * 100000)));
      data.push(Math.floor(Math.random() * (Math.random() * 100000)));
    }

    fs.appendFileSync(fileData, data.join("\n") + "\n");
    expectedSize += dataFrameLimit * 8;
    if (expectedSize > CONTENT_LENGTH * 0.66) {
      dataFrameLimit = 1000;
      fileSize = fs.statSync(fileData).size;
      if (fileSize > CONTENT_LENGTH) {
        break;
      }
    }
  }
  logger.info(
    `appendTiFile finish. generation count: ${generationCount} fileSize= ${fileSize}`
  );
  return Promise.resolve(fileName);
};
