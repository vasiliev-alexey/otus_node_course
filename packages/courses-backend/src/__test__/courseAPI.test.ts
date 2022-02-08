import { Course } from "@course/common";
import { faker } from "@faker-js/faker";
import Courses from "@models/Course";
import * as HTTP from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import request from "supertest";
import { Logger } from "tslog";

import { rootTestLogger } from "./utils";

const testLogger: Logger = rootTestLogger.getChildLogger({
  name: "course-logger",
});

describe("GET /course", () => {
  let app: HTTP.Server;

  let mongoServer: MongoMemoryServer;
  jest.setTimeout(10_000);
  let tasks: Promise<Course>[];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const rndDbName = nanoid();
    process.env.PORT = String(4000 + Number(process.env.JEST_WORKER_ID || 1));
    process.env.MONGO_URL = `${mongoServer.getUri()}${rndDbName}?authSource=admin`;
    const mod = await import("../index");
    app = mod.default;

    tasks = Array.from(Array(10).keys()).map((_) => {
      const course = new Courses({ title: faker.internet.domainName() });
      return course.save();
    });
    await Promise.all(tasks);
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

  it("response get with json", async () => {
    const val = await tasks[0];

    testLogger.debug("test req get list");

    await request(app)
      .get("/course")
      .set("Accept", "application/json")
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toStrictEqual(tasks.length);
        expect(res.body[0].title).toEqual(val.title);
      });
  });

  it("save course api by post request", async () => {
    testLogger.debug("test req post");
    await request(app)
      .post("/course")
      .send({ title: "title" })
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Object);
        testLogger.debug(res.body);
      });
  });
});
