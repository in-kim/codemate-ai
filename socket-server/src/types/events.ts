export type ClientToServerEvent =
  | { type: 'CONNECT'; workspaceId: string; userId: string }
  | { type: 'SYNC'; workspaceId: string; payload: any }
  | { type: 'LEAVE'; workspaceId: string; userId: string };

export type ServerToClientEvent =
  | { type: 'USER_JOINED'; userId: string }
  | { type: 'UPDATE'; payload: any };