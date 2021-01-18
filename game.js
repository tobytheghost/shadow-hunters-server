var io;
var gameSocket;

exports.initGame = function (sio, socket) {
  io = sio;
  gameSocket = socket;
  gameSocket.emit("connected", { message: "You are connected!" });

  gameSocket.on("getGameState", getGameState);

  // Host Events
  gameSocket.on("hostCreateNewGame", hostCreateNewGame);
  //gameSocket.on("hostRoomFull", hostPrepareGame);
  //gameSocket.on("hostCountdownFinished", hostStartGame);
  //gameSocket.on("hostNextRound", hostNextRound);

  // Player Events
  gameSocket.on("playerPassTurn", playerHandlePassTurn);
  gameSocket.on("playerJoinGame", playerJoinGame);
  //gameSocket.on("playerAnswer", playerAnswer);
  //gameSocket.on("playerRestart", playerRestart);
};

function getGameState() {
  this.emit("gameState", { mySocketId: this.id, gameState: "Game State" });
}

/**
 *
 * HOST FUNCTIONS
 *
 */

function hostCreateNewGame() {
  // Create a unique Socket.IO Room
  var thisGameId = (Math.random() * 100000) | 0;

  // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
  this.emit("newGameCreated", { gameId: thisGameId, mySocketId: this.id });

  // Join the Room and wait for the players
  this.join(thisGameId.toString());

  console.log(`Created New Game: ${thisGameId}`);
}

/**
 *
 * PLAYER FUNCTIONS
 *
 */

function playerJoinGame(data) {
  //console.log('Player ' + data.playerName + 'attempting to join game: ' + data.gameId );

  // A reference to the player's Socket.IO socket object
  var sock = this;

  // Look up the room ID in the Socket.IO adapter object.
  //console.log(gameSocket);
  const roomId = data.gameId;

  var hasRoom = gameSocket.adapter.rooms.has(data.gameId);

  // If the room exists...
  if (hasRoom) {
    // attach the socket id to the data object.
    data.mySocketId = sock.id;

    // Join the room
    sock.join(data.gameId);

    console.log("Player " + data.playerName + " joining game: " + data.gameId);

    // Emit an event notifying the clients that the player has joined the room.
    io.sockets.in(data.gameId).emit("playerJoinedRoom", data);
  } else {
    // Otherwise, send an error message back to the player.
    this.emit("error", { message: "This room does not exist." });
  }
}

function playerHandlePassTurn() {
  gameSocket.emit("playerPassedTurn", { message: "Passed turn!" });
  console.log("Passed Turn.");
}
