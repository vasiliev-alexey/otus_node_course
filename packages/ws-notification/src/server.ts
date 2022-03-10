import { Server, Socket } from "socket.io";
import { Logger } from "tslog";

const logger: Logger = new Logger({ name: "app-server" });

import { config } from "dotenv";
import express from "express";
import path from "path";

config();
const app = express();

app.use(express.static(path.resolve(__dirname, "../public")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../public", "index.html"));
});

const port = process.env.PORT || 3000;

export const httpServer = app.listen(port, () => {
  logger.info(`server started on port ${port}`);
});

export const io = new Server(httpServer, {});

const clients: Set<Socket> = new Set<Socket>();

setInterval(() => {
  logger.info("send data to clients");
  clients.forEach((socket) => {
    logger.info(`send data to client ${socket.id}`);
    socket.emit("push", `Now ${Date.now().toString()}`);
  });
}, 5000);

io.on("connect", (socket: Socket) => {
  logger.debug(`connected client with id: ${socket.id}`);

  socket.on("unsubscribe", () => {
    logger.debug("unsubscribe", socket.id);
    clients.delete(socket);
  });

  socket.on("subscribe", () => {
    logger.debug("subscribe", socket.id);
    clients.add(socket);
  });

  socket.on("disconnect", () => {
    clients.delete(socket);
    logger.info(`disconnect  client ${socket.id}`);
  });
});
