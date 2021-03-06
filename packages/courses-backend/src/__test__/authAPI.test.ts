import { AuthData, UserCredentials } from "@course/common";
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

describe("Auth api tests", () => {
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

  it("test on user register bu login and pass", async () => {
    testLogger.debug("test  auth");

    const rndUserCred: UserCredentials = {
      username: faker.internet.email(),
      password: faker.datatype.string(12),
    };

    await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(rndUserCred)
      .expect(201);
  });

  it("test on user register twice with unique username", async () => {
    testLogger.debug("test  auth");

    const rndUserCred: UserCredentials = {
      username: faker.internet.email(),
      password: faker.datatype.string(12),
    };

    await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(rndUserCred)
      .expect(201);

    await request(app)
      .post("/auth/register")
      .set("Accept", "application/json")
      .send(rndUserCred)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual("User Already Exists");
      });
  });

  it("test on user login", async () => {
    testLogger.debug("test  auth");

    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(testAuthUser)
      .expect(200)
      .expect((res) => {
        const response = res.body as AuthData;
        expect(response).not.toBeNull();
        expect(response.accessToken).not.toBeNull();
        expect(response.user).not.toBeNull();
      });
  });
});
