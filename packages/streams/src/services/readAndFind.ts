import * as fs from "fs";
import { ReadStream } from "fs";
import Path from "path";

import { MAX_INT_DIGIT } from "../types";
import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${Path.basename(__filename)}-logger`,
});

interface StreamReader {
  payload: number[];
  stream?: ReadStream;
  isActive: boolean;
  top: string;
  bottom: string;
  payloadLoaded: boolean;
}

export const readAndFind = (dataDir: string, fileParts: string[]) => {
  logger.info("start ds", fileParts);

  const readStreams: Map<string, StreamReader> = new Map();

  const outStream = fs.createWriteStream(Path.resolve(dataDir, "result.data"));

  const calcMin = () => {
    let min: number = MAX_INT_DIGIT;
    for (const r of readStreams.values()) {
      min = Math.min(min, ...r.payload);
    }

    outStream.write(String(min) + "\n");
  };

  const resumeAllStreams = () => {
    logger.debug("resume resume ");

    for (const r of readStreams.values()) {
      r.payloadLoaded = false;
      if (r.isActive) {
        r.stream.resume();
      }
    }
  };

  const countDownLock = (): boolean => {
    const allStreamsLoaded = true;
    for (const r of readStreams.values()) {
      if (r.isActive && !r.payloadLoaded) {
        return false;
      }
    }
    return allStreamsLoaded;
  };

  for (const filePart of fileParts) {
    readStreams.set(filePart, {
      isActive: false,
      top: "",
      bottom: "",
      payloadLoaded: false,
      payload: [],
    });
  }
  for (const filePartStream of fileParts) {
    logger.debug("file", filePartStream);
    const stream = fs.createReadStream(filePartStream);

    readStreams.get(filePartStream).stream = stream;
    readStreams.get(filePartStream).isActive = true;

    stream
      .on("data", (chunk) => {
        stream.pause();

        const curStream = readStreams.get(stream.path.toString());
        const data = curStream.top + chunk.toString();

        curStream.payload = data
          .split("\n")
          .map((e) => parseInt(e))
          .filter((d) => !isNaN(d));
        curStream.top = chunk.toString().endsWith("\n")
          ? ""
          : curStream.payload.pop().toString();
        curStream.payloadLoaded = true;

        if (countDownLock()) {
          logger.debug("ready to calc", stream.path);
          calcMin();
          logger.debug("call resumeAllStreams ", stream.path);
          resumeAllStreams();
        }
      })
      .on("end", () => {
        logger.info("finished", stream.path);
        readStreams.get(stream.path.toString()).isActive = false;
        if (countDownLock()) {
          calcMin();
          resumeAllStreams();
        }
      });
  }
};
