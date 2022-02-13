import { MongoMemoryServer } from "mongodb-memory-server";
import { nanoid } from "nanoid";
import { Logger } from "tslog";

export const rootTestLogger: Logger = new Logger({ name: "Main-Test-Logger" });

export const prepareInfra = async (seedFunc?: () => void) => {
  const mngServer = await MongoMemoryServer.create();
  const rndDbName = nanoid();
  const portShift = parseInt(process.env.JEST_WORKER_ID || "0");
  process.env.PORT = String(4000 + portShift);

  process.env.MONGO_URL = `${mngServer.getUri()}${rndDbName}?authSource=admin`;

  const mod = await import("../server");
  const server = mod.default;
  const appServer = server.listen(3000 + portShift);

  if (seedFunc) {
    await seedFunc();
  }

  return { mngServer, appServer };
};
