// Client-side socket event types

export interface ServerToClientEvents {
  pong: (data: { timestamp: number }) => void;
  connectionStatus: (data: { connected: boolean; clientCount: number }) => void;
  error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  ping: () => void;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface SocketState {
  isConnected: boolean;
  connectionState: ConnectionState;
  socketId: string | null;
  latency: number | null;
  error: string | null;
}
