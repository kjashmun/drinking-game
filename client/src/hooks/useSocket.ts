import { useState, useEffect } from 'react';
import { socket, testPing } from '../lib/socket';
import type { SocketState } from '../types/socket';

export const useSocket = () => {
  const [socketState, setSocketState] = useState<SocketState>({
    isConnected: socket.connected,
    connectionState: socket.connected ? 'connected' : 'disconnected',
    socketId: socket.id || null,
    latency: null,
    error: null,
  });

  useEffect(() => {
    const onConnect = () => {
      setSocketState({
        isConnected: true,
        connectionState: 'connected',
        socketId: socket.id || null,
        latency: null,
        error: null,
      });
    };

    const onDisconnect = () => {
      setSocketState(prev => ({
        ...prev,
        isConnected: false,
        connectionState: 'disconnected',
        socketId: null,
      }));
    };

    const onConnectError = (error: Error) => {
      setSocketState(prev => ({
        ...prev,
        isConnected: false,
        connectionState: 'error',
        error: error.message,
      }));
    };

    const onReconnectAttempt = () => {
      setSocketState(prev => ({
        ...prev,
        connectionState: 'connecting',
      }));
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.io.on('reconnect_attempt', onReconnectAttempt);

    // Set initial state if already connected
    if (socket.connected) {
      onConnect();
    }

    // Cleanup on unmount
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.io.off('reconnect_attempt', onReconnectAttempt);
    };
  }, []);

  const measureLatency = async (): Promise<number> => {
    try {
      const latency = await testPing();
      setSocketState(prev => ({
        ...prev,
        latency,
      }));
      return latency;
    } catch (error) {
      console.error('Ping test failed:', error);
      throw error;
    }
  };

  const reconnect = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket.connected) {
      socket.disconnect();
    }
  };

  return {
    ...socketState,
    socket,
    measureLatency,
    reconnect,
    disconnect,
  };
};
