const { checkJWT } = require("../helpers");
const { ChatMessages } = require("../models");
const { use } = require("../routes/auth");

const chatMessages = new ChatMessages();

const socketController = async (socket, io) => {
  const user = await checkJWT(socket.handshake.headers["x-token"]);

  if (!user) {
    return socket.disconnect();
  }

  // Add user to online users
  chatMessages.connectUser(user);
  io.emit("usersOnline", chatMessages.usersArr);
  socket.emit("receivedMessage", chatMessages.lastTenMsgs);

  // Connect to private room
  socket.join(user.id);

  // Remove user from online users
  socket.on("disconnect", () => {
    chatMessages.disconnectUser(user.id);
    io.emit("usersOnline", chatMessages.usersArr);
  });

  socket.on("sendMessage", ({ uid, message, time }) => {
    if (uid) {
      // Private message
      socket.to(uid).emit("receivedMsg-Private", { from: user.name, message });
    } else {
      // Global message
      chatMessages.sendMessage(user.id, user.name, message, time);
      io.emit("receivedMessage", chatMessages.lastTenMsgs);
    }
  });
};

module.exports = {
  socketController,
};
