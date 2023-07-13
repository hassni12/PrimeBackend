const UpdateTrades = require("./startup/UpdatingTradesbackground");
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { listenForTokenTransfers } = require("./utils/eventListener");
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
  },
});
app.set("view engine", "pug");
app.use((req, res, next) => {
  req.io = io;
  next();
});
require("./startup/routes")(app);
require("./startup/db")();
const port = process.env.PORT || 5000;
server.listen(port, () => {
  listenForTokenTransfers().catch((error) => {
    console.error("Error:", error);
  });
  console.log("listening on port " + port);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("newNotification", (data) => {
    console.log("New notification received:", data);

    io.emit("newNotification", data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

setInterval(() => {
  UpdateTrades();
}, 3600000);
