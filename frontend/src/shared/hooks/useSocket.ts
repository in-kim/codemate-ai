import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
const SOCKET_URL = 'http://localhost:4001';

export function useSocket({
  workSpaceId,
  userId,
  onMessage,
  onCursorUpdate
}: {
  workSpaceId: string;
  userId: string;
  onMessage: (data: unknown) => void;
  onCursorUpdate?: (data: { userId: string; line: number; column: number }) => void;
}) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 소켓이 이미 존재하면 연결 해제
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // 새로운 소켓 인스턴스 생성
    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    
    // 연결 이벤트 리스너 설정
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('CONNECT', { workSpaceId, userId });
    });

    socket.on('MESSAGE', (data) => {
      console.log('📩 Message received:', data);
      onMessage(data); // UPDATE, USER_JOINED, USER_LEAVED 등 처리
    });

    socket.on('SYNC', (data) => {
      console.log('📩 SYNC received:', {
        data,
        workSpaceId
      });
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

    // ref에 소켓 저장
    socketRef.current = socket;
    
    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [workSpaceId, userId, onMessage, onCursorUpdate]);

  const sendSync = (payload: { payload: string }) => {
    console.log('socketRef.current', payload);
    socketRef.current?.emit('SYNC', payload);
  };

  return { sendSync };
}
