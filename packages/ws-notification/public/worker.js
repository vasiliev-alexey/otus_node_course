importScripts("https://cdn.socket.io/4.4.1/socket.io.min.js");
const socket = io();

socket.on("push", (data) => {
  postMessage(data);
});

onmessage = function (e) {
  if (e.data === "subscribe") {
    socket.emit("subscribe", e.data);
  } else {
    socket.emit("unsubscribe", e.data);
  }
};
