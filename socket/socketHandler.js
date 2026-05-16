const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`📡 Client connected: ${socket.id}`);

    // Join room for specific event updates
    socket.on('join:event', (eventId) => {
      socket.join(`event:${eventId}`);
    });

    socket.on('leave:event', (eventId) => {
      socket.leave(`event:${eventId}`);
    });

    socket.on('disconnect', () => {
      console.log(`📡 Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
