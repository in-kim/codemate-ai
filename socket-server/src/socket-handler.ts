import { Socket } from 'socket.io';
import { RoomManager } from './rooms/room-manager';

const roomManager = new RoomManager();

export function handleSocketConnection(socket: Socket) {
  let roomId: string | null = null;

  socket.on('JOIN', (data) => {
    console.log(`JOIN : ${data.documentId}`);
    if (!data.documentId) return;
    roomId = data.documentId;
    roomManager.joinRoom(data.documentId, data.userId, socket);
  });

  socket.on('SYNC', (data) => {
    console.log(`SYNC : ${data.payload}`);
    if (!roomId) return;
    roomManager.broadcast(roomId, {
      type: 'UPDATE',
      payload: data.payload
    }, socket);
  });

  socket.on('SYNC_CURSOR', (data) => {
    if (!roomId) return;
    roomManager.broadcast(roomId, {
      type: 'CURSOR',
      userId: data.userId,
      line: data.line,
      column: data.column
    }, socket);
  })

  socket.on('LEAVE', (data) => {
    console.log(`LEAVE : ${data.documentId}`);
    if (!roomId || !data.documentId) return;
    roomManager.leaveRoom(data.documentId, data.userId, socket);
  });

  socket.on('disconnect', () => {
    console.log('연결 종료됨');
    if (roomId) {
      roomManager.leaveRoom(roomId, socket.id, socket);
    }
  });
}