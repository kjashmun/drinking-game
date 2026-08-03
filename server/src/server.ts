import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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

// Socket.io configuration
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`✓ Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`✗ Client disconnected: ${socket.id}`);
  });

  // Ping/pong test for Story 1.2
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: Date.now() });
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
