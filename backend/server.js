
const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Initialize Socket.IO from socket.js only
initializeSocket(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { server };
