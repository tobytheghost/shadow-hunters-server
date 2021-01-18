const Express = require("express")();
const Http = require("http").Server(Express);
const SocketIO = require("socket.io")(Http, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
const game = require("./game");

Http.listen(3001, () => {
  console.log("Listening at :3001...");
});

SocketIO.on("connection", (socket) => {
  console.log("client connected");
  game.initGame(SocketIO, socket);
});
