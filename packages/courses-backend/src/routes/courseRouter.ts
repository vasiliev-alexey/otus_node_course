import { createNewCourse, listCourse } from "@src/controllers/courseController";
import express from "express";

const courseRouter = express.Router();
export default courseRouter;

courseRouter.get("/", listCourse);
courseRouter.post("/", createNewCourse);
