import { UserCredentials } from "@course/common";
import { faker } from "@faker-js/faker";
import { UserModel } from "@models/UserModel";
import bcrypt from "bcryptjs";
import * as HTTP from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { Logger } from "tslog";

import { prepareInfra, rootTestLogger } from "./utils";

const testLogger: Logger = rootTestLogger.getChildLogger({
  name: "course-logger",
});

const testAuthUser: UserCredentials = {
  password: faker.datatype.string(12),
  username: faker.internet.email(),
};

const seedData = async () => {
  const hashedPassword = await bcrypt.hash(testAuthUser.password, 10);
  const newUser = new UserModel({
    username: testAuthUser.username,
    password: hashedPassword,
    isAdmin: true,
  });
  await newUser.save();
};

describe("Auth logout abd refresh test", () => {
  let app: HTTP.Server, mongoServer: MongoMemoryServer;
  jest.setTimeout(10_000);
  beforeAll(async () => {
    const { mngServer, appServer } = await prepareInfra(seedData);
    mongoServer = mngServer;
    app = appServer;
  });

  afterAll(async () => {
    if (app) {
      app.close();
    }
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
    }
  });

  it("test on user logout", async () => {
    testLogger.debug("test  logout");

    let token = "";
    let cookie = "";
    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(testAuthUser)
      .expect(200)
      .expect((res) => {
        expect(res.body.accessToken).not.toBeNull();
        token = res.body.accessToken;
        cookie = res.headers["set-cookie"];
        expect(cookie).toHaveLength(1);
      });

    await request(app)
      .get("/auth/logout")
      .set("cookie", cookie)
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200)
      .expect((res) => {
        cookie = res.headers["set-cookie"];
        expect(cookie[0].startsWith("refreshToken=;")).toBeTruthy();
      });
  });
  it("test on user refresh token", async () => {
    testLogger.debug("test  refresh");

    let token = "";
    let oldCookie = "";
    let cookie = "";
    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(testAuthUser)
      .expect(200)
      .expect((res) => {
        expect(res.body.token).not.toBeNull();
        token = res.body.token;
        oldCookie = res.headers["set-cookie"];
        expect(oldCookie).toHaveLength(1);
        expect(token).not.toBeNull();
      });

    await new Promise((r) => setTimeout(r, 1000));

    await request(app)
      .get("/auth/refresh")
      .set("cookie", oldCookie)
      // .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200)
      .expect((res) => {
        cookie = res.headers["set-cookie"];

        expect(cookie[0].startsWith("refreshToken=;")).toBeFalsy();
        expect(oldCookie[0]).not.toEqual(cookie[0]);
      });
  });
});
