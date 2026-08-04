// Server-side socket event types

export interface ServerToClientEvents {
  pong: (data: { timestamp: number }) => void;
  connectionStatus: (data: { connected: boolean; clientCount: number }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}

export interface InterServerEvents {
  // For future use with multiple server instances
}

export interface SocketData {
  userId?: string;
  roomCode?: string;
  playerName?: string;
}
