const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PATCH']
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

      

socket.on('join', async (data) => {
    try {
        const { userId, userType } = data;

        console.log('Join request:', { userId, userType });
        console.log('Socket ID:', socket.id);

        if (!userId || !userType) {
            console.log('Missing userId or userType');
            return;
        }

        if (userType === 'captain') {
            const captain = await captainModel.findById(userId);

            if (!captain) {
                console.log('Captain not found:', userId);
                return;
            }

            captain.socketId = socket.id;
            await captain.save();

            socket.join(userId.toString());

            const verifyCaptain = await captainModel
                .findById(userId)
                .select('socketId');

            console.log(
                'Captain socket ID saved:',
                verifyCaptain?.socketId
            );

            console.log('Captain joined room:', userId);

        } else if (userType === 'user') {
            const user = await userModel.findById(userId);

            if (!user) {
                console.log('User not found:', userId);
                return;
            }

            user.socketId = socket.id;
            await user.save();

            socket.join(userId.toString());

            console.log('User socket ID saved:', user.socketId);
            console.log('User joined room:', userId);
        }

    } catch (error) {
        console.error('Join handler error:', error);
    }
});



        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!io) {
        console.log('Socket.io not initialized');
        return;
    }

    if (!socketId) {
        console.log('Socket ID missing');
        return;
    }

    const targetSocket = io.sockets.sockets.get(socketId);

    if (!targetSocket) {
        console.log('Target socket is not connected:', socketId);
        return;
    }

    console.log('Sending event:', messageObject.event);
    console.log('Target socket:', socketId);

    targetSocket.emit(messageObject.event, messageObject.data);
};

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};