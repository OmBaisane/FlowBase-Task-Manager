const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:4200", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// Attach io to global so controllers can emit events
global.io = io;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`FlowBase server running on port ${PORT}`);
});
