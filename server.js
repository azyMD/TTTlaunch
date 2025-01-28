const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Store player data
let players = {};

// Socket.io connection
io.on('connection', (socket) => {
    console.log('a user connected:', socket.id);

    // Add player to the lobby
    socket.on('join', (name) => {
        players[socket.id] = { name, wins: 0, losses: 0, status: 'available' };
        io.emit('updateLobby', players);
    });

    // Handle game logic
    socket.on('move', (data) => {
        io.emit('updateGame', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('updateLobby', players);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});