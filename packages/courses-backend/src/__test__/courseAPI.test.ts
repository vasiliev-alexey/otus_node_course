import { Course, UserCredentials } from "@course/common";
import { faker } from "@faker-js/faker";
import { CourseModel } from "@models/CourseModel";
import { UserModel } from "@models/UserModel";
import bcrypt from "bcryptjs";
import * as HTTP from "http";
import { StatusCodes } from "http-status-codes";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { Logger } from "tslog";

import { prepareInfra, rootTestLogger } from "./utils";

const testLogger: Logger = rootTestLogger.getChildLogger({
  name: "course-logger",
});

describe("course API test  suit", () => {
  let app: HTTP.Server, mongoServer: MongoMemoryServer;

  jest.setTimeout(10_000);
  let tasks: Promise<Course>[];

  const testAuthUser: UserCredentials = {
    password: faker.datatype.string(12),
    username: faker.internet.email(),
  };

  const seedData = async (): Promise<void> => {
    testLogger.debug("data seeded");
    const hashedPassword = await bcrypt.hash(testAuthUser.password, 10);
    const newUser = new UserModel({
      username: testAuthUser.username,
      password: hashedPassword,
      isAdmin: true,
    });
    await newUser.save();

    tasks = Array.from(Array(10).keys()).map((_) => {
      const course = new CourseModel({
        title: faker.internet.domainName(),
        description: faker.hacker.abbreviation(),
      });
      return course.save();
    });
    await Promise.all(tasks);
  };

  beforeAll(async () => {
    const { mngServer, appServer } = await prepareInfra();

    mongoServer = mngServer;
    app = appServer;

    await seedData();
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
      .get("/courses")
      .set("Accept", "application/json")
      .expect(200)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.length).toStrictEqual(tasks.length);
        expect(res.body[0].title).toEqual(val.title);
      });
  });

  it("save course api by post request", async () => {
    testLogger.debug("test req post");

    const fakeCourseName = faker.company.companyName();

    let token = "";

    await request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .send(testAuthUser)
      .expect(200)
      .expect((res) => {
        expect(res.body.token).not.toBeNull();
        token = res.body.accessToken;
      });

    await request(app)
      .post("/courses/newCourse")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: fakeCourseName, description: fakeCourseName })
      .expect(StatusCodes.CREATED)
      .expect((res) => {
        expect(res.body).toBeInstanceOf(Object);
        const newCourse = res.body as Course;
        expect(newCourse.title).toEqual(fakeCourseName);
        expect(newCourse.id).not.toBeNull();
      });
  });
});
