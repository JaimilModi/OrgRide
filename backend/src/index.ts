import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', (socket) => {
  console.log(`🔌 Socket connection established: ${socket.id}`);

  socket.on('join-ride', ({ rideId }) => {
    socket.join(`ride:${rideId}`);
    console.log(`👤 Client ${socket.id} joined room ride:${rideId}`);
  });

  socket.on('driver-location-update', ({ rideId, latitude, longitude }) => {
    io.to(`ride:${rideId}`).emit('location-updated', {
      latitude,
      longitude,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(env.PORT, () => {
  console.log(`🚀 Server is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

