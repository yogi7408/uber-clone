
import React, { createContext, useEffect } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext(null);

const SOCKET_URL =
    import.meta.env.VITE_BASE_URL || 'http://localhost:4000';

const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling']
});

const SocketProvider = ({ children }) => {
    useEffect(() => {
        const handleConnect = () => {
            console.log('Socket connected:', socket.id);
        };

        const handleDisconnect = (reason) => {
            console.log('Socket disconnected:', reason);
        };

        const handleConnectError = (error) => {
            console.error('Socket connection error:', error.message);
        };

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socket.on('connect_error', handleConnectError);

        socket.connect();

        return () => {
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('connect_error', handleConnectError);
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
