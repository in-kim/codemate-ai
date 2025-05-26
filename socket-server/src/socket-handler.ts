import { Socket } from 'socket.io';
import { RoomManager } from './rooms/room-manager';

const roomManager = new RoomManager();

export function handleSocketConnection(socket: Socket) {
  let workSpaceId: string | null = null;

  socket.on('CONNECT', (data) => {
    console.log('CONNECT', data);
    if (!data.workSpaceId) return;
    workSpaceId = data.workSpaceId;
    roomManager.joinRoom(data.workSpaceId, data.userId, socket);
  });

  socket.on('SYNC', (data: { payload: string }) => {
    console.log(`SYNC Socket : \n ${JSON.stringify(data)}`);
    if (!workSpaceId) return;
    roomManager.broadcast(workSpaceId, {
      type: 'UPDATE',
      payload: data.payload
    }, socket);
  });

  socket.on('SYNC_CURSOR', (data) => {
    if (!workSpaceId) return;
    roomManager.broadcast(workSpaceId, {
      type: 'CURSOR',
      userId: data.userId,
      line: data.line,
      column: data.column
    }, socket);
  })

  socket.on('LEAVE', (data) => {
    console.log(`LEAVE : ${data.workSpaceId}`);
    if (!workSpaceId || !data.workSpaceId) return;
    roomManager.leaveRoom(data.workSpaceId, data.userId, socket);
  });

  socket.on('DISCONNECT', () => {
    console.log('연결 종료됨');
    if (workSpaceId) {
      roomManager.leaveRoom(workSpaceId, socket.id, socket);
    }
  });
}