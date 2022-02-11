import { authRouter } from "@src/routes/authRouter";
import express from "express";
import swaggerUi from "swagger-ui-express";

import { courseRouter } from "./courseRouter";

export const rootRouter = express.Router();

rootRouter.use("/courses", courseRouter);
rootRouter.use("/auth", authRouter);

rootRouter.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
