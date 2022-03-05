import * as fs from "fs";
import Path from "path";

import { rootLogger } from "./logger";

const maxChunkSize = 5_000_000;
const log = rootLogger.getChildLogger({
  name: "splitAndSort-logger",
});

export function splitFile(
  dataDir: string,
  fileName: string,
  splitCount: number
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    log.info("start splitFile");
    const fileData = Path.resolve(dataDir, fileName);
    const filePartNames = new Set<string>();
    let totalContentSize = 0;
    let currentContentSize = 0;

    const meta = fs.statSync(fileData);
    const inputStream = fs.createReadStream(fileData, {
      autoClose: true,
      highWaterMark: 8000,
    });

    const maxFileSize = Math.floor(meta.size / splitCount);

    log.info("maxFileSize ", maxFileSize);
    let partNum = 0;

    let dataArray: string[] = [];
    let dataArrayHolder: string[] = [];
    let tailString = "";
    const writeChunk = (append = false) => {
      if (append) {
        const dataPartName = Path.resolve(dataDir, `data.part${partNum}`);
        filePartNames.add(dataPartName);
        fs.appendFileSync(dataPartName, dataArrayHolder.join("\n"));
      } else {
        partNum++;
        const dataPartName = Path.resolve(dataDir, `data.part${partNum}`);

        fs.appendFileSync(dataPartName, dataArrayHolder.join("\n"));
      }

      dataArrayHolder = [];
    };

    inputStream
      .on("data", (data) => {
        totalContentSize += data.length;
        currentContentSize += data.length;
        dataArray = data.toString().split("\n");
        dataArray[0] = tailString.concat(dataArray[0]);
        if (data.toString().endsWith("\n")) {
          tailString = "";
        } else {
          tailString = dataArray.pop();
        }

        dataArrayHolder = dataArrayHolder.concat(dataArray);

        if (totalContentSize > maxFileSize) {
          writeChunk();
          totalContentSize = 0;
          currentContentSize = 0;
        } else if (currentContentSize > maxChunkSize) {
          writeChunk(true);
          currentContentSize = 0;
        }
      })
      .on("end", () => {
        writeChunk();
        dataArrayHolder = [];
        dataArray = [];
        log.info("call destroy");
        inputStream.close();
        inputStream.destroy();
        resolve([...filePartNames]);
      })
      .on("error", () => {
        reject();
      });

    log.info("end splitFile");
  });
}
