import express from 'express';
import materialController from '../controllers/materialController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// --- Rotas Públicas ---
// Rota para listar materiais (sem autenticação para permitir navegação livre)
router.get('/', materialController.listarMateriais);

// Rota para buscar material específico (sem autenticação para permitir visualização)
router.get('/:id', materialController.buscarPorId);

// --- Rotas Protegidas (exigem autenticação JWT) ---

// Rota para cadastrar novo material
router.post('/', authMiddleware, materialController.cadastrarMaterial);

// Rotas específicas (devem vir antes das genéricas)
router.patch('/:id/disponibilidade', authMiddleware, materialController.alterarDisponibilidade);

// Rotas genéricas
router.put('/:id', authMiddleware, materialController.atualizarMaterial);
router.delete('/:id', authMiddleware, materialController.excluirMaterial);

export default router;