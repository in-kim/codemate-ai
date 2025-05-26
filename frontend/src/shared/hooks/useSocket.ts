import { io, Socket } from 'socket.io-client';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/auth-store';

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
  const isLoginRef = useRef<boolean>(false);
  
  // 인증 상태 확인
  const getIsLogin = useAuthStore(state => state.getIsLogin);

  // 소켓 연결 해제 함수
  const disconnectSocket = () => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting socket due to session end or logout');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    // 로그인 상태 확인
    isLoginRef.current = getIsLogin();
    
    // 로그인되지 않았거나 필수 정보가 없으면 소켓 연결하지 않음
    if (!isLoginRef.current || !userId || !workSpaceId) {
      console.log('🚫 Socket connection prevented: Not logged in or missing required data');
      disconnectSocket();
      return;
    }

    // 소켓이 이미 존재하면 연결 해제
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // 새로운 소켓 인스턴스 생성
    const socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      auth: {
        userId,
        workSpaceId
      }
    });
    
    // 연결 이벤트 리스너 설정
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('CONNECT', { workSpaceId, userId });
    });

    socket.on('MESSAGE', (data) => {
      // 인증 상태 재확인
      if (!getIsLogin()) {
        disconnectSocket();
        return;
      }
      
      console.log('📩 Message received:', data);
      onMessage(data); // UPDATE, USER_JOINED, USER_LEAVED 등 처리
    });

    socket.on('SYNC', (data) => {
      // 인증 상태 재확인
      if (!getIsLogin()) {
        disconnectSocket();
        return;
      }
      
      console.log('📩 SYNC received:', {
        data,
        workSpaceId
      });
      onMessage(data); // UPDATE, USER_JOINED, USER_LEAVED 등 처리
    });

    socket.on('SYNC_CURSOR', (data) => {
      // 인증 상태 재확인
      if (!getIsLogin()) {
        disconnectSocket();
        return;
      }
      
      console.log('📍 Remote cursor received:', data);
      if (data.userId !== userId && onCursorUpdate) {
        onCursorUpdate(data); // 외부로 전달해서 UI에서 처리
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      socketRef.current = null;
    });

    socket.on('error', (error) => {
      console.error('🔴 Socket error:', error);
      // 인증 오류인 경우 연결 해제
      if (error === 'Authentication error' || error === 'Unauthorized') {
        disconnectSocket();
      }
    });

    // 서버에서 세션 만료 이벤트 수신
    socket.on('SESSION_EXPIRED', () => {
      console.log('⏰ Session expired, disconnecting socket');
      disconnectSocket();
    });

    // ref에 소켓 저장
    socketRef.current = socket;
    
    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [workSpaceId, userId, onMessage, onCursorUpdate, getIsLogin]);

  useEffect(() => {
    const checkAuthStatus = () => {
      const currentLoginState = getIsLogin();
      
      // 로그인 상태가 변경되었고, 로그아웃된 경우
      if (isLoginRef.current && !currentLoginState) {
        console.log('👤 User logged out, disconnecting socket');
        disconnectSocket();
      }
      
      isLoginRef.current = currentLoginState;
    };
    
    // 주기적으로 인증 상태 확인 (5초마다)
    const intervalId = setInterval(checkAuthStatus, 5000);
    
    return () => clearInterval(intervalId);
  }, [getIsLogin]);

  const sendSync = (payload: { payload: string }) => {
    // 로그인 상태 및 소켓 연결 확인 후 메시지 전송
    if (getIsLogin() && socketRef.current?.connected) {
      console.log('📤 Sending sync:', payload);
      socketRef.current.emit('SYNC', payload);
    } else {
      console.log('🚫 Cannot send sync: Not logged in or socket not connected');
    }
  };

  return { sendSync, disconnectSocket };
}
