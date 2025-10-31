import express from 'express';
import mensagemController from '../controllers/mensagemController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Enviar nova mensagem
router.post('/', verificarToken, mensagemController.enviarMensagem);

// Buscar mensagem por ID
router.get('/:id', verificarToken, mensagemController.buscarPorId);

// Listar mensagens com filtros (geralmente por chat_id)
router.get('/', verificarToken, mensagemController.listarMensagens);

// Contar mensagens não lidas de um chat para um usuário
router.get('/chat/:chat_id/usuario/:usuario_id/nao-lidas', verificarToken, mensagemController.contarNaoLidas);

// Marcar mensagem como lida
router.patch('/:id/lida', verificarToken, mensagemController.marcarComoLida);

// Marcar todas as mensagens de um chat como lidas
router.patch('/chat/:chat_id/marcar-todas-lidas', verificarToken, mensagemController.marcarTodasComoLidas);

// Excluir mensagem
router.delete('/:id', verificarToken, mensagemController.excluirMensagem);

export default router;
