import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
const SOCKET_URL = 'http://localhost:4001';

export function useSocket({
  documentId,
  userId,
  onMessage,
  onCursorUpdate
}: {
  documentId: string;
  userId: string;
  onMessage: (data: unknown) => void;
  onCursorUpdate?: (data: { userId: string; line: number; column: number }) => void;
}) {
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('JOIN', { documentId, userId });
    });

    socket.on('message', (data) => {
      console.log('📩 Message received:', data);
      onMessage(data); // UPDATE, USER_JOINED, USER_LEAVED 등 처리
    });

    socket.on('SYNC_CURSOR', (data) => {
      console.log('📍 Remote cursor received:', data);
      if (data.userId !== userId && onCursorUpdate) {
        onCursorUpdate(data); // 외부로 전달해서 UI에서 처리
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socketRef.current = socket;

    return () => {
      socket.emit('LEAVE', { documentId, userId });
      socket.disconnect();
    };
  }, [documentId, onCursorUpdate, onMessage, userId]);

  const sendSync = (payload: unknown) => {
    socketRef.current?.emit('SYNC', { documentId, userId, payload });
  };

  return { sendSync };
}
