import express from 'express';
import notificacaoController from '../controllers/notificacaoController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar nova notificação
router.post('/', verificarToken, notificacaoController.criarNotificacao);

// Buscar notificação por ID
router.get('/:id', verificarToken, notificacaoController.buscarPorId);

// Listar notificações com filtros
router.get('/', verificarToken, notificacaoController.listarNotificacoes);

// Contar notificações não lidas de um usuário
router.get('/usuario/:usuario_id/nao-lidas', verificarToken, notificacaoController.contarNaoLidas);

// Atualizar notificação
router.put('/:id', verificarToken, notificacaoController.atualizarNotificacao);

// Marcar notificação como lida
router.patch('/:id/lida', verificarToken, notificacaoController.marcarComoLida);

// Marcar todas as notificações de um usuário como lidas
router.patch('/usuario/:usuario_id/marcar-todas-lidas', verificarToken, notificacaoController.marcarTodasComoLidas);

// Excluir notificação
router.delete('/:id', verificarToken, notificacaoController.excluirNotificacao);

export default router;
