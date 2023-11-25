const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const formatMessage = require("./utils/message");
const candidates = require("./utils/constant");
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8000;
app.use(express.static("public"));

io.on("connection", (socket) => {
  io.emit("update", candidates);

  socket.on("vote", (index) => {
    if (candidates[index]) {
      candidates[index].vote += 1;
    }
    io.emit("update", candidates);
  });

  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage(msg));
  });
});

httpServer.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
