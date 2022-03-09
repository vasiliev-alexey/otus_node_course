import Loki from "lokijs";
import path from "path";

import { rootLogger } from "./logger";

const logger = rootLogger.getChildLogger({
  name: `${path.basename(__filename)}-logger`,
});

class Storage {
  private db: Loki;

  constructor() {
    this.db = new Loki("settings.db", {
      autosave: true,
      autoload: true,
    });

    const entries = this.db.getCollection("token");
    if (entries === null) {
      this.db.addCollection("token");
    }
  }

  public saveToken(token: string) {
    logger.debug("save token");
    this.db.getCollection("token").insert({ token });
    this.db.save();
    this.db.close();
  }

  public clearToken(): Promise<void> {
    return new Promise((resolve) => {
      this.db.getCollection("token").removeDataOnly();
      this.db.saveDatabase();
      this.db.close();
      resolve();
    });
  }

  public async getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      let token = "";
      this.db.loadDatabase({}, (err) => {
        if (err) {
          reject(err);
        }
        const data = this.db.getCollection("token").find();
        token = data[0]?.token || "";
        this.db.close();
        resolve(token);
      });
    });
  }
}

const storage = new Storage();

export { storage };
