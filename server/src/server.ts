import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import type { 
  ServerToClientEvents, 
  ClientToServerEvents, 
  InterServerEvents, 
  SocketData 
} from './types/socket.js';

// Load environment variables
dotenv.config();

const isDev = process.env.NODE_ENV !== 'production';

const app = express();
const httpServer = createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Socket.io configuration with TypeScript types
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: corsOptions,
});

// Track connected clients
let connectedClients = 0;

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    connectedClients,
    uptime: process.uptime(),
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  connectedClients++;
  
  if (isDev) {
    console.log(`✓ Client connected: ${socket.id}`);
    console.log(`  Total clients: ${connectedClients}`);
    console.log(`  Transport: ${socket.conn.transport.name}`);
  }

  // Broadcast updated client count to all clients
  io.emit('connectionStatus', { 
    connected: true, 
    clientCount: connectedClients 
  });

  socket.on('disconnect', (reason) => {
    connectedClients--;
    
    if (isDev) {
      console.log(`✗ Client disconnected: ${socket.id}`);
      console.log(`  Reason: ${reason}`);
      console.log(`  Total clients: ${connectedClients}`);
    }

    // Broadcast updated client count to all clients
    io.emit('connectionStatus', { 
      connected: true, 
      clientCount: connectedClients 
    });
  });

  // Ping/pong test for latency measurement
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
    
    if (isDev) {
      console.log(`⟳ Ping received from ${socket.id}`);
    }
  });

  // Error handling
  socket.on('error', (error) => {
    console.error(`✗ Socket error for ${socket.id}:`, error);
    socket.emit('error', { message: 'An error occurred' });
  });
});

// Server configuration
const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Drinking Game Server                                  ║
╠════════════════════════════════════════════════════════╣
║  Status: Running                                       ║
║  Port: ${PORT}                                            ║
║  Host: ${HOST}                                      ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║  WebSocket: Enabled                                    ║
║  Debug Logging: ${isDev ? 'ON' : 'OFF'}                                   ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
