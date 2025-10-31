import express from 'express';
import chatController from '../controllers/chatController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar novo chat
router.post('/', verificarToken, chatController.criarChat);

// Buscar chat por ID
router.get('/:id', verificarToken, chatController.buscarPorId);

// Listar chats com filtros
router.get('/', verificarToken, chatController.listarChats);

// Atualizar chat
router.put('/:id', verificarToken, chatController.atualizarChat);

// Desativar chat
router.patch('/:id/desativar', verificarToken, chatController.desativarChat);

// Excluir chat
router.delete('/:id', verificarToken, chatController.excluirChat);

export default router;
