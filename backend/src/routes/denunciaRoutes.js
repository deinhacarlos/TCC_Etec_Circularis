import express from 'express';
import denunciaController from '../controllers/denunciaController.js';
import verificarToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Criar nova denúncia
router.post('/', verificarToken, denunciaController.criarDenuncia);

// Buscar denúncia por ID
router.get('/:id', verificarToken, denunciaController.buscarPorId);

// Listar denúncias com filtros
router.get('/', verificarToken, denunciaController.listarDenuncias);

// Atualizar denúncia
router.put('/:id', verificarToken, denunciaController.atualizarDenuncia);

// Resolver denúncia (marcar como resolvida)
router.patch('/:id/resolver', verificarToken, denunciaController.resolverDenuncia);

// Excluir denúncia
router.delete('/:id', verificarToken, denunciaController.excluirDenuncia);

export default router;
