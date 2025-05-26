const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");
const { handleSocketConnection } = require('./dist/socket-handler');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: 'http://localhost:3000', // 프론트 URL
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

io.on("connection", handleSocketConnection);

const PORT = 4001;
httpServer.listen(PORT, () => {
  console.log(`[HTTP] Test page available at http://localhost:${PORT}`);
  console.log(`[Socket] Socket.IO server listening on ws://localhost:${PORT}`);
});