import esort from "external-sorting";
import fs from "fs";
import path from "path";

import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${path.basename(__filename)}-logger`,
});

export const sortFiles = async (files: string[]): Promise<string[]> => {
  const dataSortedFiles = new Set<string>();

  for (const file of files) {
    logger.info("sorted  ", file);
    const fileNameSorted = file + "_sorted";
    dataSortedFiles.add(fileNameSorted);
    const task = esort({
      input: fs.createReadStream(file, {
        autoClose: true,
      }),
      output: fs.createWriteStream(fileNameSorted),
      deserializer: parseInt,
      tempDir: "/tmp",
      maxHeap: 1000,
      serializer: (v: number) => v.toString(),
    }).asc();
    await task;
  }

  return Promise.resolve([...dataSortedFiles]);
};
