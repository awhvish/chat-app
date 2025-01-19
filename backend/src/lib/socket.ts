import { Server } from "socket.io";
import http from 'http';
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5174"],
        methods: ["GET", "POST"]
    },
});

const userSocketMap: { [key: string]: string } = {};

export function getRecieverSocketId(userId: string): string {
    return userSocketMap[userId];
}

io.on('connection', (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (typeof userId === 'string') {
        userSocketMap[userId] = socket.id;
        console.log("User mapped:", { userId, socketId: socket.id });
    }
    
    // Emit online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle new messages
    socket.on("newMessage", (message) => {
        console.log("New message received:", message);
        const receiverSocketId = userSocketMap[message.receiverId];
        const senderSocketId = userSocketMap[message.senderId];

        if (receiverSocketId) {
            console.log("Emitting to receiver:", receiverSocketId);
            io.to(receiverSocketId).emit("newMessage", message);
        }

        if (senderSocketId) {
            console.log("Emitting to sender:", senderSocketId);
            io.to(senderSocketId).emit("newMessage", message);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (typeof userId === 'string') {
            delete userSocketMap[userId];
            console.log("User removed from mapping:", userId);
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Debug helper to periodically log connected users
setInterval(() => {
    console.log("Connected users:", userSocketMap);
}, 10000);

export { io, app, server };