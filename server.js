const http = require("http");
const {Server} = require("socket.io");
const app = require("./app");
const socketHandlers = require("./sockets/index");
const {parse} = require("cookie");

const PORT = process.env.PORT;
const HOST = process.env.HOST;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach socket.io to server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Handle WebSocket connections

io.on("connection", (socket) => {
  console.log("🔌 New WebSocket connection:", socket.id);

  const cookieHeader = socket.handshake.headers.cookie;
  const cookies = parse(cookieHeader || "");
  const sessionID = cookies.token;

  socket.sessionID = sessionID;

  socket.on("join-room", (groupID) => {
    socket.join(groupID);
    console.log(`✅ Socket ${socket.id} joined room ${groupID}`);
  });

  // 🔹 CHAT MESSAGE HANDLER — use your imported handler here
  socket.on("send-message", (data) => {
    socketHandlers.handleChatMessage(socket, data);
  });

  // 🔹 DISCONNECT LOG
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start the HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
