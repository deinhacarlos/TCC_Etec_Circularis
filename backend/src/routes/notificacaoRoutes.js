import express from 'express';
import notificacaoController from '../controllers/notificacaoController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Aplica proteção (opcional)
router.use(authMiddleware);

// Criar nova notificação (POST /api/notificacoes)
router.post('/', notificacaoController.criar);
// =================================

// Listar
router.get('/', notificacaoController.listar);

// Contar não lidas
router.get('/contar/:userId', notificacaoController.contar);

// Ações de Atualização
router.patch('/:id/lida', notificacaoController.marcarLida);
router.patch('/usuario/:userId/marcar-todas-lidas', notificacaoController.marcarTodasLidas);

// Ações de Exclusão
router.delete('/:id', notificacaoController.excluir);
router.delete('/usuario/:userId', notificacaoController.excluirTodas);

export default router;