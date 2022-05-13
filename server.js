const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketio(server);

// Importing the message formatting function from the 'utils' folder
const formatMessage = require("./utils/chat-messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

// Creating a bot here:
const botName = "PingIO Bot";

// Setting Front-end folder as static:
app.use(express.static(path.join(__dirname, "frontend")));

// Runs when a client connects:
io.on("connection", (socket) => {
  socket.on("joinRoom", (username, room) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // Welcoming current user:
    socket.emit("message", formatMessage(botName, "Welcome to PingIO!"));

    // Broadcast this when a user connects:
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat!`)
      );

    // Send users & room info: (when a user connects)
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listening for our chat message here:
  socket.on("chat-message", (ourMessage) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, ourMessage));
  });

  // Runs when a user disconnects from the chat:
  socket.on("disconnect", () => {
    // Getting the user by the id:
    const user = userLeaves(socket.id);

    // Condition: if the user is same (matching the id), then do the following:
    if (user) {
      // sending a message to everybody
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat!`)
      );
      // Send users & room info: (when a user disconnects)
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`PingIO listening on port: ${PORT}`);
});
