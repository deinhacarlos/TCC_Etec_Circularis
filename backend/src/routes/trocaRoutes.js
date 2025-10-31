import express from 'express';
import trocaController from '../controllers/trocaController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar nova troca (solicitar troca)
router.post('/', verificarToken, trocaController.criarTroca);

// Buscar troca por ID
router.get('/:id', verificarToken, trocaController.buscarPorId);

// Listar trocas com filtros
router.get('/', verificarToken, trocaController.listarTrocas);

// Atualizar troca (observações)
router.put('/:id', verificarToken, trocaController.atualizarTroca);

// Concluir troca
router.patch('/:id/concluir', verificarToken, trocaController.concluirTroca);

// Cancelar troca
router.delete('/:id', verificarToken, trocaController.cancelarTroca);

export default router;
