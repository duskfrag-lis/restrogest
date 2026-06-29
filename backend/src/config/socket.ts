import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';

let io: SocketServer;

export const initSocket = (httpServer: HttpServer): SocketServer => {

    io = new SocketServer(httpServer, {

        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        console.log(`Cliente conectado: ${socket.id}`);

        socket.on('join_kitchen', () => {
            socket.join('kitchen');
            console.log(`Cliente unido a sala de cocina: ${socket.id}`);
        });

        socket.on('join_waiter', (waiterId: string) => {
            socket.join(`waiter_${waiterId}`);
            console.log(`Mesero conectado: ${waiterId}`);
        });

        socket.on('disconnect', () => {
            console.log(`Cliente desconectado: ${socket.id}`);
        });
    });

    return io;
};

export const getIO = (): SocketServer => {

    if (!io) throw new Error('Socket.io no ha sido iniciado');
    return io;
};