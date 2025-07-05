const http = require("http");
const { Server } = require("socket.io");
const app = require('./app');
const socketHandlers = require('./sockets/index'); 

const PORT = process.env.PORT;
const HOST = process.env.HOST 

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.127:5173",
    credentials: true,
  },
});
//socketHandlers.handleChatMessage(io);

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("🔌 New WebSocket connection:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start the HTTP + WebSocket server
server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});