const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Create the server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (if needed)
app.use(express.static("public"));

// Handle client connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Handle screen sharing initiation
  socket.on("screen-share", (data) => {
    console.log(`Screen sharing started by ${socket.id}`);
    socket.broadcast.emit("screen-share-data", data); // Broadcast to other clients
  });

  // Handle feedback updates from clients
  socket.on("update-feedback", (feedbackData) => {
    console.log(`Feedback updated by ${socket.id}:`, feedbackData);
    socket.broadcast.emit("update-feedback", feedbackData); // Send to all clients except sender
  });

  // Handle audio sharing from the client
  socket.on("audio-data", (audioBlob) => {
    console.log(`Audio data received from ${socket.id}`);
    socket.broadcast.emit("play-audio", audioBlob); // Send to all clients except sender
  });

  // Notify when a client disconnects
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    console.log(`Total connected clients: ${io.engine.clientsCount}`);
  });
});

// Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
