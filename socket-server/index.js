const { Server } = require("socket.io");
const io = new Server(5000, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("code_change", (data) => {
    socket.broadcast.emit("code_change", data);
  });
});

