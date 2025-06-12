const express = require('express');
const { createServer } = require('http');
const { Server } = require("socket.io");
const { handleSocketConnection } = require('./dist/socket-handler');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 환경 변수 설정
const NODE_ENV = process.env.NODE_ENV || 'development';

// 환경에 따라 다른 환경 변수 파일 로드
if (NODE_ENV === 'production') {
  dotenv.config({ path: path.resolve(__dirname, '.env.prod') });
  console.log('프로덕션 환경 변수 로드 완료');
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.local') });
  console.log('개발 환경 변수 로드 완료');
}

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // 프론트 URL
  credentials: true,
}));

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

io.on("connection", handleSocketConnection);

const PORT = 4001;
httpServer.listen(PORT, () => {
  console.log(`[HTTP] Test page available at ${process.env.FRONTEND_URL}`);
  console.log(`[Socket] Socket.IO server listening on ws://${process.env.FRONTEND_URL}`);
});