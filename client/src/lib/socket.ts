import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../types/socket';

// Determine socket URL based on environment
const getSocketUrl = (): string => {
  // Check environment variable first
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  // Auto-detect from current hostname
  // This ensures phones connecting via local IP use the correct URL
  const hostname = window.location.hostname;
  const port = 3001;
  
  return `http://${hostname}:${port}`;
};

const SOCKET_URL = getSocketUrl();

// Socket.io client with TypeScript types
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(SOCKET_URL, {
  // Reconnection configuration with exponential backoff
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  
  // Auto-connect on initialization
  autoConnect: true,
  
  // Transport options
  transports: ['websocket', 'polling'],
});

// Development logging
const isDev = import.meta.env.VITE_DEBUG === 'true';

if (isDev) {
  socket.on('connect', () => {
    console.log(`✓ WebSocket connected: ${socket.id}`);
    console.log(`  URL: ${SOCKET_URL}`);
  });

  socket.on('disconnect', (reason) => {
    console.log(`✗ WebSocket disconnected: ${reason}`);
  });

  socket.on('connect_error', (error) => {
    console.error('✗ WebSocket connection error:', error.message);
  });

  socket.io.on('reconnect', (attemptNumber: number) => {
    console.log(`✓ WebSocket reconnected after ${attemptNumber} attempts`);
  });

  socket.io.on('reconnect_attempt', (attemptNumber: number) => {
    console.log(`⟳ WebSocket reconnection attempt ${attemptNumber}...`);
  });

  socket.io.on('reconnect_error', (error: Error) => {
    console.error('✗ WebSocket reconnection error:', error.message);
  });

  socket.io.on('reconnect_failed', () => {
    console.error('✗ WebSocket reconnection failed after max attempts');
  });
}

// Helper function to test connection with ping/pong
export const testPing = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const timeout = setTimeout(() => {
      reject(new Error('Ping timeout'));
    }, 5000);

    socket.emit('ping');
    
    const pongHandler = () => {
      clearTimeout(timeout);
      const latency = Date.now() - startTime;
      resolve(latency);
      socket.off('pong', pongHandler);
    };

    socket.on('pong', pongHandler);
  });
};

export default socket;
