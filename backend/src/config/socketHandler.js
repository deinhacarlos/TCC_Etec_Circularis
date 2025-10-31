import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

let io;

export function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*", // Em produção, especificar domínios permitidos
      methods: ["GET", "POST"]
    }
  });

  // Middleware de autenticação para Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Token não fornecido'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      return next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Usuário conectado: ${socket.userId} (Socket ID: ${socket.id})`);

    // Entrar em uma sala de chat específica
    socket.on('join_chat', (chatId) => {
      socket.join(`chat_${chatId}`);
      console.log(`Usuário ${socket.userId} entrou no chat ${chatId}`);
    });

    // Sair de uma sala de chat
    socket.on('leave_chat', (chatId) => {
      socket.leave(`chat_${chatId}`);
      console.log(`Usuário ${socket.userId} saiu do chat ${chatId}`);
    });

    // Enviar mensagem em tempo real
    socket.on('send_message', (data) => {
      const { chatId, mensagem } = data;
      
      // Emitir mensagem para todos os usuários na sala do chat
      io.to(`chat_${chatId}`).emit('receive_message', {
        ...mensagem,
        timestamp: new Date()
      });
      
      console.log(`Mensagem enviada no chat ${chatId} por usuário ${socket.userId}`);
    });

    // Notificar que o usuário está digitando
    socket.on('typing', (data) => {
      const { chatId, usuarioNome } = data;
      socket.to(`chat_${chatId}`).emit('user_typing', {
        chatId,
        usuarioNome
      });
    });

    // Notificar que o usuário parou de digitar
    socket.on('stop_typing', (data) => {
      const { chatId } = data;
      socket.to(`chat_${chatId}`).emit('user_stop_typing', {
        chatId
      });
    });

    // Desconexão
    socket.on('disconnect', () => {
      console.log(`❌ Usuário desconectado: ${socket.userId} (Socket ID: ${socket.id})`);
    });
  });

  return io;
}

// Função para emitir notificações em tempo real
export function emitNotification(usuarioId, notificacao) {
  if (io) {
    io.to(`user_${usuarioId}`).emit('new_notification', notificacao);
  }
}

// Função para obter a instância do Socket.IO
export function getIO() {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado');
  }
  return io;
}

export default { initializeSocket, emitNotification, getIO };
