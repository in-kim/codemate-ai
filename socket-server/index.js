const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");
const { handleSocketConnection } = require('./dist/socket-handler');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

// Serve test page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test.html'));
});

io.on("connection", handleSocketConnection);

const PORT = 4001;
httpServer.listen(PORT, () => {
  console.log(`[HTTP] Test page available at http://localhost:${PORT}`);
  console.log(`[Socket] Socket.IO server listening on ws://localhost:${PORT}`);
});