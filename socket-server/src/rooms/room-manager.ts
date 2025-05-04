import { Socket } from 'socket.io';

interface Room {
  users: Map<string, Socket>;
}

export class RoomManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  joinRoom(roomId: string, userId: string, socket: Socket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { users: new Map() });
    }
    
    const room = this.rooms.get(roomId)!;
    room.users.set(userId, socket);
    console.log(`[Room] ${userId}] ${userId} joined (${room.users.size} total)`);

    // 다른 사용자들에게 알림
    this.broadcast(roomId, {
      type: 'USER_JOINED',
      userId
    }, socket);
  }

  leaveRoom(roomId: string, userId: string, socket: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users.delete(userId);
    console.log(`[Room] ${userId}] user left (${room.users.size} remaining)`);
    
    if (room.users.size === 0) {
      this.rooms.delete(roomId);
    }

    this.broadcast(roomId, {
      type: 'USER_LEAVED',
      userId
    }, socket);
  }

  broadcast(roomId: string, message: any, sender: Socket) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users.forEach((socket) => {
      if (socket !== sender) {
        socket.emit('message', message);
      }
    });
  }
}