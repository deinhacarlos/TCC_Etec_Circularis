import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    try {
      // CORREÇÃO: Usando JWT_SEGREDO (conforme seu .env) em vez de JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SEGREDO);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuário conectado: ${socket.userId} (Socket ID: ${socket.id})`);

    socket.join(`user_${socket.userId}`); // Sala pessoal para notificações

    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Usuário ${socket.userId} entrou no chat ${chatId}`);
    });

    socket.on('send_message', (data) => {
      const { chatId, mensagem } = data;
      io.to(`chat_${chatId}`).emit('receive_message', {
        ...mensagem,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ Usuário desconectado: ${socket.userId}`);
    });
  });

  return io;
}

export function emitNotification(usuarioId, notificacao) {
  if (io) {
    io.to(`user_${usuarioId}`).emit('new_notification', notificacao);
  }
}

export function getIO() {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado');
  }
  return io;
}

export default { initializeSocket, emitNotification, getIO };