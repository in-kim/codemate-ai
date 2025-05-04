export type ClientToServerEvent =
  | { type: 'JOIN'; documentId: string; userId: string }
  | { type: 'SYNC'; documentId: string; payload: any }
  | { type: 'LEAVE'; roomId: string; userId: string };

export type ServerToClientEvent =
  | { type: 'USER_JOINED'; userId: string }
  | { type: 'UPDATE'; payload: any };